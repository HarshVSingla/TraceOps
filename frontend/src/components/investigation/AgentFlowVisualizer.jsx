import {
  Activity,
  Terminal,
  GitCommit,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react";
import { Badge } from "../common/Badge";

export function AgentFlowVisualizer({ currentStep, isRunning }) {
  // Steps: 0: Idle, 1: Orchestrator, 2: Parallel Agents (Log, Deploy, Knowledge), 3: Root Cause, 4: Done
  const agents = [
    {
      id: "orchestrator",
      name: "Orchestrator Agent",
      role: "Coordinates subagents & sets investigation plan",
      icon: Activity,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      stepThreshold: 1,
    },
    {
      id: "log_agent",
      name: "Log Agent",
      role: "Scans error traces & cluster anomaly logs",
      icon: Terminal,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      stepThreshold: 2,
    },
    {
      id: "deployment_agent",
      name: "Deployment Agent",
      role: "Audits git commits & config diffs",
      icon: GitCommit,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      stepThreshold: 2,
    },
    {
      id: "knowledge_agent",
      name: "Knowledge Agent",
      role: "Semantic search over runbooks & past postmortems",
      icon: BookOpen,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      stepThreshold: 2,
    },
    {
      id: "root_cause_agent",
      name: "Root Cause Agent",
      role: "Synthesizes evidence & computes confidence score",
      icon: ShieldCheck,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      stepThreshold: 3,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs md:text-sm font-semibold text-slate-100 font-mono">
            Multi-Agent Pipeline Execution Graph
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Badge variant="investigating" size="sm" dot>
              AGENTS RUNNING
            </Badge>
          ) : currentStep >= 4 ? (
            <Badge variant="healthy" size="sm" dot>
              ANALYSIS COMPLETE
            </Badge>
          ) : (
            <Badge variant="neutral" size="sm">
              STANDBY
            </Badge>
          )}
        </div>
      </div>

      {/* Agents Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isCurrentActive = isRunning && currentStep === agent.stepThreshold;
          const isDone = currentStep > agent.stepThreshold || currentStep >= 4;

          return (
            <div
              key={agent.id}
              className={`p-3.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                isCurrentActive
                  ? "border-cyan-400/60 bg-cyan-950/30 shadow-md shadow-cyan-950"
                  : isDone
                  ? "border-slate-800 bg-slate-900/80"
                  : "border-slate-800/40 bg-slate-950/40 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center ${agent.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    {isCurrentActive ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                </div>

                <div className="font-semibold text-slate-200 font-mono text-[11px] truncate">
                  {agent.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {agent.role}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                {isCurrentActive ? (
                  <span className="text-cyan-400 animate-pulse">Running step...</span>
                ) : isDone ? (
                  <span className="text-emerald-400">Completed ✓</span>
                ) : (
                  <span className="text-slate-600">Waiting for trigger</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
