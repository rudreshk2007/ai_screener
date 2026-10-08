import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllQuestionnaireConfigs } from "@/lib/screening/config-loader";

export async function GET() {
  try {
    const raw = prisma.getRawData();

    // Aggregations without exposing PII
    const totalUsers = raw.users.length;
    const totalChildren = raw.children.length;
    const totalScreenings = raw.screenings.length;
    const completedScreenings = raw.screenings.filter((s) => s.status === "COMPLETED").length;

    const riskBreakdown = {
      LOW: raw.screenings.filter((s) => s.riskLevel === "LOW").length,
      MEDIUM: raw.screenings.filter((s) => s.riskLevel === "MEDIUM").length,
      HIGH: raw.screenings.filter((s) => s.riskLevel === "HIGH").length,
    };

    const auditLogsCount = raw.auditLogs.length;
    const questionnaires = getAllQuestionnaireConfigs().map((q) => ({
      id: q.id,
      name: q.name,
      version: q.version,
      ageBand: q.targetAgeBand.label,
      isPlaceholder: !!q.isPlaceholder,
      questionCount: q.questions.length,
    }));

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalChildren,
        totalScreenings,
        completedScreenings,
        riskBreakdown,
        auditLogsCount,
      },
      questionnaires,
      recentAuditLogs: raw.auditLogs.slice(-10).reverse(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load admin stats";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
