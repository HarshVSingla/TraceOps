import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";

export function RemediationAction({
  recommendedFix,
  proposedPatch,
  humanApprovalRequired = true,
  onApplied,
}) {
  const [status, setStatus] = useState("idle"); // 'idle', 'applying', 'applied'
  const [logs, setLogs] = useState([]);

  const handleApprove = () => {
    setStatus("applying");
    setLogs(["[09:02:40] SRE signature approved: alex.rivera@traceops.internal"]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "[09:02:41] Triggering deployment rollback to target v2.3.9 via Kubernetes rollout...",
      ]);
    }, 900);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        "[09:02:43] Pod payment-api-7b49-d89f rolling restart: 3/3 healthy",
        "[09:02:44] Database pool connections returned to nominal: 18 active / 50 max",
      ]);
      setStatus("applied");
      onApplied?.();
    }, 2200);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Recommended Remediation &amp; Human Approval
          </h3>
        </div>
        {humanApprovalRequired && status !== "applied" && (
          <Badge variant="p1" size="sm" dot>
            Approval Required
          </Badge>
        )}
        {status === "applied" && (
          <Badge variant="resolved" size="sm" dot>
            Remediation Executed
          </Badge>
        )}
      </div>

      {/* Human Approval Warning Banner */}
      {humanApprovalRequired && status === "idle" && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="font-semibold block">Safety Guard Active:</span>
            <span>
              Autonomous execution is paused. Review the proposed fix and configuration diff below before granting approval.
            </span>
          </div>
        </div>
      )}

      {/* Recommended Fix Description */}
      <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <span className="font-mono text-cyan-400 font-semibold block mb-1">
          Proposal:
        </span>
        {recommendedFix ||
          "Revert deployment v2.4.0 back to v2.3.9 or hotfix DB_POOL_MAX to 50 in config/database.py."}
      </div>

      {/* Code / Config Patch Diff */}
      {proposedPatch && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            Proposed Configuration Patch:
          </span>
          <pre className="p-3 rounded-lg bg-[#070a10] border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
            {proposedPatch.split("\n").map((line, i) => {
              const isAdd = line.startsWith("+");
              const isDel = line.startsWith("-") && !line.startsWith("---");
              return (
                <div
                  key={i}
                  className={
                    isAdd
                      ? "text-emerald-400 bg-emerald-950/30"
                      : isDel
                      ? "text-rose-400 bg-rose-950/30"
                      : "text-slate-400"
                  }
                >
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      )}

      {/* Live execution log feedback when applying */}
      {logs.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
          {logs.map((log, idx) => (
            <div key={idx} className="text-cyan-300">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 font-mono">
          Target Service: <span className="text-slate-200">payment-api</span> (Rollback to v2.3.9)
        </div>

        {status === "idle" ? (
          <Button
            variant="primary"
            size="md"
            icon={CheckCircle2}
            onClick={handleApprove}
          >
            Approve &amp; Execute Remediation
          </Button>
        ) : status === "applying" ? (
          <Button variant="primary" size="md" isLoading disabled>
            Executing Rollout...
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Rollback v2.3.9 Successfully Applied &amp; Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}
