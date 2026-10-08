import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));
    const userEmail = session?.user?.email || body.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Authentication or email required to process deletion" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.id;

    // Log deletion event first
    await logAuditEvent({
      userId: null,
      action: "DATA_DELETED",
      resourceType: "User",
      resourceId: userId,
      details: "Parent exercised DPDP Act 2023 Right to Erasure - all records cascaded and destroyed",
    });

    // Cascade delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "All personal data, children profiles, screenings, and results have been permanently erased.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to erase data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
