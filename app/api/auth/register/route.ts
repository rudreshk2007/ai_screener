import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agreedToDPDP: z.boolean().refine((val) => val === true, {
    message: "DPDP Act consent is mandatory for child developmental screening",
  }),
  consentVersion: z.string().default("1.0.0-dpdp2023"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Web Browser";

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        passwordHash: validated.password,
        role: "PARENT",
        consents: {
          create: {
            version: validated.consentVersion,
            agreedToDPDP: true,
            termsAccepted: true,
            ipAddress,
            userAgent,
          },
        },
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "CONSENT_GIVEN",
      resourceType: "Consent",
      resourceId: user.id,
      details: `Consent version ${validated.consentVersion} accepted under DPDP Act 2023`,
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || "Validation failed" }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
