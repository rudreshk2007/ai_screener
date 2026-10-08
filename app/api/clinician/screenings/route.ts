import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const raw = prisma.getRawData();
    // Return all completed screenings with child details
    const screenings = raw.screenings
      .filter((s) => s.status === "COMPLETED")
      .map((s) => {
        const child = raw.children.find((c) => c.id === s.childId);
        const result = raw.results.find((r) => r.screeningId === s.id);
        const user = raw.users.find((u) => u.id === s.userId);
        return {
          ...s,
          childName: child ? child.name : "Anonymous",
          childDob: child ? child.dateOfBirth : null,
          parentEmail: user ? user.email : "Confidential",
          result,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ screenings });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch clinician queue";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
