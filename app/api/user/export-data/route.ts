import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const emailParam = url.searchParams.get("email");
    const userEmail = session?.user?.email || emailParam || "parent@earlysteps.org";

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const raw = prisma.getRawData();
    const consents = raw.consents.filter((c) => c.userId === user.id);
    const children = raw.children.filter((c) => c.userId === user.id);
    const screenings = raw.screenings.filter((s) => s.userId === user.id);
    const screeningIds = screenings.map((s) => s.id);
    const answers = raw.answers.filter((a) => screeningIds.includes(a.screeningId));
    const results = raw.results.filter((r) => screeningIds.includes(r.screeningId));

    await logAuditEvent({
      userId: user.id,
      action: "DATA_EXPORTED",
      resourceType: "User",
      resourceId: user.id,
      details: "Parent exported full health records under DPDP Act 2023 Right to Portability",
    });

    const exportPayload = {
      compliance: "India Digital Personal Data Protection (DPDP) Act 2023",
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      consents,
      children,
      screenings,
      answers,
      results,
    };

    return new Response(JSON.stringify(exportPayload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="earlysteps-data-export-${user.id}.json"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to export data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
