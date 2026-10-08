import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreScreening } from "@/lib/screening/scoring";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { screeningId, answers } = await req.json();

    if (!screeningId || !answers) {
      return NextResponse.json({ error: "screeningId and answers are required" }, { status: 400 });
    }

    const screening = await prisma.screening.findUnique({
      where: { id: screeningId },
      include: { child: true },
    });

    if (!screening) {
      return NextResponse.json({ error: "Screening session not found" }, { status: 404 });
    }

    // Run pure clinical scoring engine
    const scoreResult = scoreScreening(screening.questionnaireId as string, answers);

    // Save individual answers
    for (const detail of scoreResult.details) {
      await prisma.answer.create({
        data: {
          screeningId,
          questionId: detail.questionId,
          response: detail.response,
          scoreValue: detail.scoreContribution,
        },
      });
    }

    // Update screening status & risk level
    await prisma.screening.update({
      where: { id: screeningId },
      data: {
        status: "COMPLETED",
        totalScore: scoreResult.totalScore,
        riskLevel: scoreResult.riskLevel,
        completedAt: new Date().toISOString(),
      },
    });

    // Save Result record
    const resultRecord = await prisma.result.create({
      data: {
        screeningId,
        riskLevel: scoreResult.riskLevel,
        score: scoreResult.totalScore,
        summary: scoreResult.summary,
        recommendationsJson: JSON.stringify(scoreResult.recommendedActions),
      },
    });

    // Audit log
    await logAuditEvent({
      userId: screening.userId as string,
      action: "SCREENING_SUBMITTED",
      resourceType: "Screening",
      resourceId: screeningId,
      details: `Completed with total score ${scoreResult.totalScore} -> ${scoreResult.riskLevel}`,
    });

    return NextResponse.json({
      success: true,
      scoreResult,
      resultRecord,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to score and submit screening";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
