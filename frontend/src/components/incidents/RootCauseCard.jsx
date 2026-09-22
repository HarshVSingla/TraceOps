import { Sparkles, Check } from "lucide-react";

import { Badge } from "../common/Badge";

export function RootCauseCard({ investigation }) {
  if (!investigation) return null;

  const { root_cause_analysis } = investigation;
  if (!root_cause_analysis) return null;

  return (
    <div className="rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950/15 via-slate-900/60 to-slate-900/40 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>AI Synthesized Root Cause Analysis</span>
              <Badge variant="ai" size="sm">
                SYNTHESIZED
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-correlated across logs, git diffs, and knowledge runbooks
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
          <span className="text-xs text-slate-400 font-mono">Confidence:</span>
          <span className="text-xs font-mono font-bold text-purple-400">
            {root_cause_analysis.confidence}
          </span>
        </div>
      </div>

      {/* Incident Summary */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
          Incident Summary
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
          {root_cause_analysis.incident_summary}
        </p>
      </div>

      {/* Root Cause Details */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-mono uppercase text-purple-300 tracking-wider">
          Identified Root Cause
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-purple-950/20 p-3.5 rounded-lg border border-purple-500/30 font-medium">
          {root_cause_analysis.root_cause}
        </p>
      </div>

      {/* Cross-Agent Evidence Items */}
      {root_cause_analysis.evidence && root_cause_analysis.evidence.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Supporting Evidence
          </h4>
          <div className="space-y-1.5">
            {root_cause_analysis.evidence.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80"
              >
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Steps */}
      {root_cause_analysis.verification_steps && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
            Automated Verification Checklist
          </h4>
          <div className="space-y-1.5">
            {root_cause_analysis.verification_steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-400 font-mono"
              >
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-[10px] flex items-center justify-center text-slate-300">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
