"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  AlertTriangle,
  Lock,
  Clock,
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats() ;
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium">Loading administrative audit records...</p>
      </div>
    );
  }

  const { metrics, questionnaires, recentAuditLogs } = stats || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>System Administration &amp; Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Admin Governance &amp; DPDP Audit Panel
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor anonymized developmental metrics, questionnaire versions, and privacy audit logs.
        </p>
      </div>

      {/* Aggregate Metrics (Anonymized) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Parent Accounts</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics?.totalUsers || 0}</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Registered Children</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics?.totalChildren || 0}</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Completed Screenings</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics?.completedScreenings || 0}</p>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">DPDP Audit Events</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics?.auditLogsCount || 0}</p>
        </div>
      </div>

      {/* Questionnaire Configurations Status */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-600" />
          <span>Configured Screening Instruments (/config/screening/*.json)</span>
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {questionnaires?.map((q: any) => (
            <div key={q.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div>
                <strong className="text-sm font-semibold text-slate-900 dark:text-white block">{q.name}</strong>
                <span className="text-slate-500 dark:text-slate-400">
                  ID: {q.id} • Version: {q.version} • Target Age: {q.ageBand} ({q.questionCount} items)
                </span>
              </div>
              <div>
                {q.isPlaceholder ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                    Draft Placeholder (Clinician Review Pending)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    Validated &amp; Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent DPDP Audit Trail */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <span>Recent DPDP Audit Trail (Sanitized — Zero PII)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Resource</th>
                <th className="p-3">Details</th>
                <th className="p-3">IP (Masked)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAuditLogs?.map((log: any) => (
                <tr key={log.id}>
                  <td className="p-3 font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-300">{log.action}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{log.resourceType}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{log.details || "-"}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{log.ipAddress || "local"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
