import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireConfig } from "@/lib/screening/config-loader";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const screening = await prisma.screening.findUnique({
      where: { id: params.id },
      include: {
        child: true,
        answers: true,
        result: true,
      },
    });

    if (!screening) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 });
    }

    const config = getQuestionnaireConfig(screening.questionnaireId as string);

    // Parse recommendations
    let recommendations: string[] = [];
    if (screening.result && (screening.result as { recommendationsJson?: string }).recommendationsJson) {
      try {
        recommendations = JSON.parse((screening.result as { recommendationsJson: string }).recommendationsJson);
      } catch {
        recommendations = [];
      }
    }

    return NextResponse.json({
      screening,
      config,
      recommendations,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching screening details";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
