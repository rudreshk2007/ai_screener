import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { screeningId, clinicianNotes, doctorName } = await req.json();

    if (!screeningId || !clinicianNotes) {
      return NextResponse.json({ error: "Screening ID and clinical notes are required" }, { status: 400 });
    }

    const screening = await prisma.screening.update({
      where: { id: screeningId },
      data: { clinicianNotes },
    });

    await logAuditEvent({
      userId: null,
      action: "CLINICIAN_NOTE_ADDED",
      resourceType: "Screening",
      resourceId: screeningId,
      details: `Clinical notes updated by ${doctorName || "Reviewing Specialist"}`,
    });

    return NextResponse.json({ success: true, screening });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to record clinical notes";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
