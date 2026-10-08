import { prisma } from "./prisma";

export type AuditAction =
  | "CONSENT_GIVEN"
  | "CHILD_CREATED"
  | "CHILD_UPDATED"
  | "CHILD_DELETED"
  | "SCREENING_STARTED"
  | "SCREENING_SUBMITTED"
  | "CLINICIAN_NOTE_ADDED"
  | "DATA_EXPORTED"
  | "DATA_DELETED";

export async function logAuditEvent({
  userId,
  action,
  resourceType,
  resourceId,
  details,
  ipAddress,
}: {
  userId?: string | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: string | null;
  details?: string;
  ipAddress?: string | null;
}) {
  try {
    // DPDP 2023 rule: No raw PII in logs
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        resourceType,
        resourceId: resourceId || null,
        details: details || null,
        ipAddress: ipAddress ? ipAddress.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.$2.xxx.xxx") : null,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log entry:", err);
  }
}
