import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const child = await prisma.child.findUnique({
      where: { id: params.id },
      include: { screenings: true },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    return NextResponse.json({ child });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching child";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const child = await prisma.child.findUnique({
      where: { id: params.id },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    await prisma.child.delete({
      where: { id: params.id },
    });

    await logAuditEvent({
      userId: child.userId,
      action: "CHILD_DELETED",
      resourceType: "Child",
      resourceId: params.id,
      details: "Child profile and related screening records removed by parent request",
    });

    return NextResponse.json({ success: true, message: "Child profile deleted" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete child";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
