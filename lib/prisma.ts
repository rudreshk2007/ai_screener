import fs from "fs";
import path from "path";
import os from "os";

// Detect execution environment:
// In Vercel and AWS Lambda, process.cwd() is read-only (/var/task).
// Only /tmp is writable.
function resolveDbPaths(): { dataDir: string; dbFile: string; bundledDbFile: string } {
  const bundledDbFile = path.join(process.cwd(), "data", "db.json");

  // 1. Explicit override via environment variable
  if (process.env.DB_FILE_PATH) {
    return {
      dataDir: path.dirname(process.env.DB_FILE_PATH),
      dbFile: process.env.DB_FILE_PATH,
      bundledDbFile,
    };
  }

  // 2. Serverless / Read-Only environment check (Vercel, AWS Lambda, Netlify, or /var/task)
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NETLIFY) ||
    process.cwd().startsWith("/var/task");

  if (isServerless) {
    const tmpDataDir = path.join(os.tmpdir(), "earlysteps-data");
    return {
      dataDir: tmpDataDir,
      dbFile: path.join(tmpDataDir, "db.json"),
      bundledDbFile,
    };
  }

  // 3. Standard local development / persistent server environment
  const localDataDir = path.join(process.cwd(), "data");
  return {
    dataDir: localDataDir,
    dbFile: path.join(localDataDir, "db.json"),
    bundledDbFile,
  };
}

export interface UserModel {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentModel {
  id: string;
  userId: string;
  version: string;
  agreedToDPDP: boolean;
  termsAccepted: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  consentedAt: string;
}

export interface ChildModel {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender: string | null;
  isPremature: boolean;
  gestationalWeeks: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScreeningModel {
  id: string;
  childId: string;
  userId: string;
  questionnaireId: string;
  status: string; // "IN_PROGRESS" | "COMPLETED"
  totalScore: number;
  riskLevel: string | null;
  clinicianNotes: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface AnswerModel {
  id: string;
  screeningId: string;
  questionId: number;
  response: string; // "YES" | "NO"
  scoreValue: number;
  createdAt: string;
}

export interface ResultModel {
  id: string;
  screeningId: string;
  riskLevel: string;
  score: number;
  summary: string;
  recommendationsJson: string;
  generatedAt: string;
}

export interface AuditLogModel {
  id: string;
  userId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  details: string | null;
  ipAddress: string | null;
  timestamp: string;
}

interface DatabaseSchema {
  users: UserModel[];
  consents: ConsentModel[];
  children: ChildModel[];
  screenings: ScreeningModel[];
  answers: AnswerModel[];
  results: ResultModel[];
  auditLogs: AuditLogModel[];
}

function uid(prefix = "c"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

class EarlyStepsDatabase {
  private data: DatabaseSchema;
  private dataDir: string;
  private dbFile: string;
  private bundledDbFile: string;
  private lastDiskMtime: number = 0;

  constructor() {
    const paths = resolveDbPaths();
    this.dataDir = paths.dataDir;
    this.dbFile = paths.dbFile;
    this.bundledDbFile = paths.bundledDbFile;
    this.data = this.load();
  }

  private getInitialSchema(): DatabaseSchema {
    return {
      users: [],
      consents: [],
      children: [],
      screenings: [],
      answers: [],
      results: [],
      auditLogs: [],
    };
  }

  private load(): DatabaseSchema {
    // 1. If active dbFile exists and was modified, read from disk
    try {
      if (fs.existsSync(this.dbFile)) {
        const stat = fs.statSync(this.dbFile);
        if (stat.mtimeMs > this.lastDiskMtime || !this.data) {
          const content = fs.readFileSync(this.dbFile, "utf8");
          this.data = JSON.parse(content);
          this.lastDiskMtime = stat.mtimeMs;
        }
        return this.data;
      }
    } catch (err) {
      console.warn("[EarlySteps DB] Failed reading active db file, checking fallbacks:", err);
    }

    // 2. If memory already holds state, keep it (do not wipe out modifications if disk was read-only)
    if (this.data) {
      return this.data;
    }

    // 3. Fallback: Seed from bundled repository data/db.json (safe for read-only /var/task)
    try {
      if (fs.existsSync(this.bundledDbFile)) {
        const content = fs.readFileSync(this.bundledDbFile, "utf8");
        this.data = JSON.parse(content);
        // Best-effort write to writable location
        this.save();
        return this.data;
      }
    } catch (err) {
      console.warn("[EarlySteps DB] Failed reading bundled db.json template:", err);
    }

    // 4. Fallback to clean schema
    this.data = this.getInitialSchema();
    return this.data;
  }

  private save(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dbFile, JSON.stringify(this.data, null, 2), "utf8");
      try {
        this.lastDiskMtime = fs.statSync(this.dbFile).mtimeMs;
      } catch {
        // ignore
      }
    } catch (err: any) {
      // If writing failed due to EROFS (Read-only filesystem) and we haven't switched to os.tmpdir():
      if ((err?.code === "EROFS" || err?.message?.includes("read-only")) && !this.dbFile.startsWith(os.tmpdir())) {
        try {
          const tmpDir = path.join(os.tmpdir(), "earlysteps-data");
          if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
          }
          this.dataDir = tmpDir;
          this.dbFile = path.join(tmpDir, "db.json");
          fs.writeFileSync(this.dbFile, JSON.stringify(this.data, null, 2), "utf8");
          try {
            this.lastDiskMtime = fs.statSync(this.dbFile).mtimeMs;
          } catch {
            // ignore
          }
          console.warn(`[EarlySteps DB] Read-only filesystem detected; successfully redirected to ${this.dbFile}`);
          return;
        } catch (fallbackErr) {
          console.warn("[EarlySteps DB] Temporary storage write failed; maintaining state in-memory:", fallbackErr);
        }
      } else {
        console.warn("[EarlySteps DB] Storage write failed; maintaining state in-memory:", err?.message || err);
      }
    }
  }

  public getRawData(): DatabaseSchema {
    return this.data;
  }

  // --- USER API ---
  public user = {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
      this.data = this.load();
      return (
        this.data.users.find((u) => {
          if (where.id && u.id === where.id) return true;
          if (where.email && u.email.toLowerCase() === where.email.toLowerCase()) return true;
          return false;
        }) || null
      );
    },
    findFirst: async (args?: { where?: Partial<UserModel> }) => {
      this.data = this.load();
      if (!args?.where) return this.data.users[0] || null;
      return (
        this.data.users.find((u) =>
          Object.entries(args.where!).every(([k, v]) => (u as any)[k] === v)
        ) || null
      );
    },
    findMany: async (args?: { where?: Partial<UserModel> }) => {
      this.data = this.load();
      if (!args?.where) return [...this.data.users];
      return this.data.users.filter((u) =>
        Object.entries(args.where!).every(([k, v]) => (u as any)[k] === v)
      );
    },
    create: async ({
      data,
    }: {
      data: {
        email: string;
        name: string;
        passwordHash?: string | null;
        role?: string;
        consents?: {
          create: {
            version?: string;
            agreedToDPDP?: boolean;
            termsAccepted?: boolean;
            ipAddress?: string | null;
            userAgent?: string | null;
          };
        };
      };
    }) => {
      this.data = this.load();
      const existing = this.data.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
      if (existing) {
        throw new Error(`User with email ${data.email} already exists`);
      }
      const user: UserModel = {
        id: uid("usr"),
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash || null,
        role: data.role || "PARENT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.users.push(user);

      if (data.consents?.create) {
        const consent: ConsentModel = {
          id: uid("cns"),
          userId: user.id,
          version: data.consents.create.version || "1.0.0-dpdp2023",
          agreedToDPDP: data.consents.create.agreedToDPDP ?? true,
          termsAccepted: data.consents.create.termsAccepted ?? true,
          ipAddress: data.consents.create.ipAddress || null,
          userAgent: data.consents.create.userAgent || null,
          consentedAt: new Date().toISOString(),
        };
        this.data.consents.push(consent);
      }

      this.save();
      return user;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<UserModel> }) => {
      this.data = this.load();
      const user = this.data.users.find((u) => u.id === where.id);
      if (!user) throw new Error(`User ${where.id} not found`);
      Object.assign(user, data, { updatedAt: new Date().toISOString() });
      this.save();
      return user;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      this.data = this.load();
      const index = this.data.users.findIndex((u) => u.id === where.id);
      if (index === -1) throw new Error(`User ${where.id} not found`);
      const deleted = this.data.users.splice(index, 1)[0];
      // Cascade delete
      const userChildIds = this.data.children.filter((c) => c.userId === where.id).map((c) => c.id);
      const userScreenings = this.data.screenings.filter((s) => s.userId === where.id).map((s) => s.id);
      this.data.consents = this.data.consents.filter((c) => c.userId !== where.id);
      this.data.children = this.data.children.filter((c) => c.userId !== where.id);
      this.data.screenings = this.data.screenings.filter((s) => s.userId !== where.id);
      this.data.answers = this.data.answers.filter((a) => !userScreenings.includes(a.screeningId));
      this.data.results = this.data.results.filter((r) => !userScreenings.includes(r.screeningId));
      this.save();
      return deleted;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.users.length;
      this.data.users = [];
      this.save();
      return { count };
    },
  };

  // --- CONSENT API ---
  public consent = {
    findFirst: async ({ where }: { where: { userId: string } }) => {
      this.data = this.load();
      return this.data.consents.find((c) => c.userId === where.userId) || null;
    },
    create: async ({ data }: { data: Omit<ConsentModel, "id" | "consentedAt"> }) => {
      this.data = this.load();
      const consent: ConsentModel = {
        id: uid("cns"),
        ...data,
        consentedAt: new Date().toISOString(),
      };
      this.data.consents.push(consent);
      this.save();
      return consent;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.consents.length;
      this.data.consents = [];
      this.save();
      return { count };
    },
  };

  // --- CHILD API ---
  public child = {
    findUnique: async ({
      where,
      include,
    }: {
      where: { id: string };
      include?: { screenings?: boolean };
    }) => {
      this.data = this.load();
      const child = this.data.children.find((c) => c.id === where.id);
      if (!child) return null;
      if (include?.screenings) {
        const screenings = this.data.screenings
          .filter((s) => s.childId === child.id)
          .map((s) => ({
            ...s,
            result: this.data.results.find((r) => r.screeningId === s.id) || null,
          }));
        return { ...child, screenings };
      }
      return child;
    },
    findMany: async ({
      where,
      include,
      orderBy,
    }: {
      where?: { userId?: string };
      include?: { screenings?: boolean };
      orderBy?: { createdAt?: "asc" | "desc" };
    } = {}) => {
      this.data = this.load();
      let list = this.data.children;
      if (where?.userId) {
        list = list.filter((c) => c.userId === where.userId);
      }
      if (orderBy?.createdAt) {
        list.sort((a, b) =>
          orderBy.createdAt === "desc"
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (include?.screenings) {
        return list.map((child) => ({
          ...child,
          screenings: this.data.screenings
            .filter((s) => s.childId === child.id)
            .map((s) => ({
              ...s,
              result: this.data.results.find((r) => r.screeningId === s.id) || null,
            })),
        }));
      }
      return list;
    },
    create: async ({ data }: { data: Omit<ChildModel, "id" | "createdAt" | "updatedAt"> }) => {
      this.data = this.load();
      const child: ChildModel = {
        id: uid("chd"),
        userId: data.userId,
        name: data.name,
        dateOfBirth: typeof data.dateOfBirth === "string" ? data.dateOfBirth : new Date(data.dateOfBirth).toISOString(),
        gender: data.gender || null,
        isPremature: data.isPremature ?? false,
        gestationalWeeks: data.gestationalWeeks || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.children.push(child);
      this.save();
      return child;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<ChildModel> }) => {
      this.data = this.load();
      const child = this.data.children.find((c) => c.id === where.id);
      if (!child) throw new Error(`Child ${where.id} not found`);
      Object.assign(child, data, { updatedAt: new Date().toISOString() });
      this.save();
      return child;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      this.data = this.load();
      const index = this.data.children.findIndex((c) => c.id === where.id);
      if (index === -1) throw new Error(`Child ${where.id} not found`);
      const deleted = this.data.children.splice(index, 1)[0];
      const screenings = this.data.screenings.filter((s) => s.childId === where.id).map((s) => s.id);
      this.data.screenings = this.data.screenings.filter((s) => s.childId !== where.id);
      this.data.answers = this.data.answers.filter((a) => !screenings.includes(a.screeningId));
      this.data.results = this.data.results.filter((r) => !screenings.includes(r.screeningId));
      this.save();
      return deleted;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.children.length;
      this.data.children = [];
      this.save();
      return { count };
    },
  };

  // --- SCREENING API ---
  public screening = {
    findUnique: async ({
      where,
      include,
    }: {
      where: { id: string };
      include?: { child?: boolean; user?: boolean; answers?: boolean; result?: boolean };
    }) => {
      this.data = this.load();
      const screening = this.data.screenings.find((s) => s.id === where.id);
      if (!screening) return null;

      const full: Record<string, unknown> = { ...screening };
      if (include?.child) {
        full.child = this.data.children.find((c) => c.id === screening.childId) || null;
      }
      if (include?.user) {
        full.user = this.data.users.find((u) => u.id === screening.userId) || null;
      }
      if (include?.answers) {
        full.answers = this.data.answers.filter((a) => a.screeningId === screening.id);
      }
      if (include?.result) {
        full.result = this.data.results.find((r) => r.screeningId === screening.id) || null;
      }
      return full;
    },
    findMany: async ({
      where,
      include,
      orderBy,
    }: {
      where?: { userId?: string; childId?: string; status?: string };
      include?: { child?: boolean; result?: boolean; user?: boolean; answers?: boolean };
      orderBy?: { createdAt?: "asc" | "desc" };
    } = {}) => {
      this.data = this.load();
      let list = this.data.screenings;
      if (where?.userId) list = list.filter((s) => s.userId === where.userId);
      if (where?.childId) list = list.filter((s) => s.childId === where.childId);
      if (where?.status) list = list.filter((s) => s.status === where.status);

      if (orderBy?.createdAt) {
        list.sort((a, b) =>
          orderBy.createdAt === "desc"
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }

      return list.map((screening) => {
        const full: Record<string, unknown> = { ...screening };
        if (include?.child) {
          full.child = this.data.children.find((c) => c.id === screening.childId) || null;
        }
        if (include?.result) {
          full.result = this.data.results.find((r) => r.screeningId === screening.id) || null;
        }
        if (include?.user) {
          full.user = this.data.users.find((u) => u.id === screening.userId) || null;
        }
        if (include?.answers) {
          full.answers = this.data.answers.filter((a) => a.screeningId === screening.id);
        }
        return full;
      });
    },
    create: async ({
      data,
    }: {
      data: {
        childId: string;
        userId: string;
        questionnaireId: string;
        status?: string;
        totalScore?: number;
        riskLevel?: string | null;
        clinicianNotes?: string | null;
        completedAt?: string | null;
      };
    }) => {
      this.data = this.load();
      const screening: ScreeningModel = {
        id: uid("scr"),
        childId: data.childId,
        userId: data.userId,
        questionnaireId: data.questionnaireId,
        status: data.status || "IN_PROGRESS",
        totalScore: data.totalScore || 0,
        riskLevel: data.riskLevel || null,
        clinicianNotes: data.clinicianNotes || null,
        createdAt: new Date().toISOString(),
        completedAt: data.completedAt ? new Date(data.completedAt).toISOString() : null,
      };
      this.data.screenings.push(screening);
      this.save();
      return screening;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<ScreeningModel> }) => {
      this.data = this.load();
      const screening = this.data.screenings.find((s) => s.id === where.id);
      if (!screening) throw new Error(`Screening ${where.id} not found`);
      Object.assign(screening, data);
      this.save();
      return screening;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      this.data = this.load();
      const index = this.data.screenings.findIndex((s) => s.id === where.id);
      if (index === -1) throw new Error(`Screening ${where.id} not found`);
      const deleted = this.data.screenings.splice(index, 1)[0];
      this.data.answers = this.data.answers.filter((a) => a.screeningId !== where.id);
      this.data.results = this.data.results.filter((r) => r.screeningId !== where.id);
      this.save();
      return deleted;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.screenings.length;
      this.data.screenings = [];
      this.save();
      return { count };
    },
  };

  // --- ANSWER API ---
  public answer = {
    findMany: async ({ where }: { where: { screeningId: string } }) => {
      this.data = this.load();
      return this.data.answers.filter((a) => a.screeningId === where.screeningId);
    },
    create: async ({ data }: { data: Omit<AnswerModel, "id" | "createdAt"> }) => {
      this.data = this.load();
      // Update or create
      const existing = this.data.answers.find(
        (a) => a.screeningId === data.screeningId && a.questionId === data.questionId
      );
      if (existing) {
        existing.response = data.response;
        existing.scoreValue = data.scoreValue;
        this.save();
        return existing;
      }
      const answer: AnswerModel = {
        id: uid("ans"),
        ...data,
        createdAt: new Date().toISOString(),
      };
      this.data.answers.push(answer);
      this.save();
      return answer;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.answers.length;
      this.data.answers = [];
      this.save();
      return { count };
    },
  };

  // --- RESULT API ---
  public result = {
    findUnique: async ({ where }: { where: { screeningId: string } }) => {
      this.data = this.load();
      return this.data.results.find((r) => r.screeningId === where.screeningId) || null;
    },
    create: async ({ data }: { data: Omit<ResultModel, "id" | "generatedAt"> }) => {
      this.data = this.load();
      const existingIdx = this.data.results.findIndex((r) => r.screeningId === data.screeningId);
      const result: ResultModel = {
        id: uid("res"),
        ...data,
        generatedAt: new Date().toISOString(),
      };
      if (existingIdx !== -1) {
        this.data.results[existingIdx] = result;
      } else {
        this.data.results.push(result);
      }
      this.save();
      return result;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.results.length;
      this.data.results = [];
      this.save();
      return { count };
    },
  };

  // --- AUDIT LOG API ---
  public auditLog = {
    findMany: async ({
      where,
      orderBy,
    }: {
      where?: { userId?: string };
      orderBy?: { timestamp?: "asc" | "desc" };
    } = {}) => {
      this.data = this.load();
      let list = this.data.auditLogs;
      if (where?.userId) list = list.filter((l) => l.userId === where.userId);
      if (orderBy?.timestamp === "desc") {
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      return list;
    },
    create: async ({ data }: { data: Omit<AuditLogModel, "id" | "timestamp"> }) => {
      this.data = this.load();
      const log: AuditLogModel = {
        id: uid("log"),
        ...data,
        timestamp: new Date().toISOString(),
      };
      this.data.auditLogs.push(log);
      this.save();
      return log;
    },
    deleteMany: async () => {
      this.data = this.load();
      const count = this.data.auditLogs.length;
      this.data.auditLogs = [];
      this.save();
      return { count };
    },
  };

  public async $disconnect() {
    this.save();
  }
}

// Global singleton instance across all environments (including serverless Lambdas)
const globalForDb = globalThis as unknown as { earlystepsDb?: EarlyStepsDatabase };
export const prisma = globalForDb.earlystepsDb ?? new EarlyStepsDatabase();
globalForDb.earlystepsDb = prisma;
