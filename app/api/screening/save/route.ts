import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireConfig } from "@/lib/screening/config-loader";

export async function POST(req: Request) {
  try {
    const { screeningId, questionId, response } = await req.json();

    if (!screeningId || questionId === undefined || !response) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const screening = await prisma.screening.findUnique({ where: { id: screeningId } });
    if (!screening) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 });
    }

    // Determine risk contribution for this individual question
    const config = getQuestionnaireConfig(screening.questionnaireId as string);
    const question = config.questions.find((q) => q.id === Number(questionId));
    const scoreValue = question && response === question.riskAnswer ? 1 : 0;

    const answer = await prisma.answer.create({
      data: {
        screeningId,
        questionId: Number(questionId),
        response,
        scoreValue,
      },
    });

    return NextResponse.json({ success: true, answer, savedAt: new Date().toISOString() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to auto-save answer";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
