import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getQuestionnaireForAge, getQuestionnaireConfig } from "@/lib/screening/config-loader";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { childId, questionnaireId: overrideQuestionnaireId } = await req.json();

    if (!childId) {
      return NextResponse.json({ error: "childId is required" }, { status: 400 });
    }

    const child = await prisma.child.findUnique({ where: { id: childId } });
    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Calculate age in months
    const dob = new Date(child.dateOfBirth);
    const now = new Date();
    const ageInMonths = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 30.4375));

    // Match questionnaire
    const config = overrideQuestionnaireId
      ? getQuestionnaireConfig(overrideQuestionnaireId)
      : getQuestionnaireForAge(ageInMonths);

    // Create screening session
    const screening = await prisma.screening.create({
      data: {
        childId: child.id,
        userId: child.userId,
        questionnaireId: config.id,
        status: "IN_PROGRESS",
      },
    });

    await logAuditEvent({
      userId: child.userId,
      action: "SCREENING_STARTED",
      resourceType: "Screening",
      resourceId: screening.id,
      details: `Started ${config.id} for child age ${ageInMonths}m`,
    });

    return NextResponse.json({
      screeningId: screening.id,
      child: {
        id: child.id,
        name: child.name,
        ageInMonths,
        gender: child.gender,
        isPremature: child.isPremature,
      },
      config,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to start screening";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
