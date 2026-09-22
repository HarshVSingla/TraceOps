import {
  GitCommit,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Terminal,
} from "lucide-react";

export function IncidentTimeline({ timeline = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "deployment":
        return { icon: GitCommit, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "error":
        return { icon: Terminal, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
      case "alert":
        return { icon: AlertTriangle, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
      case "ai":
        return { icon: Sparkles, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" };
      case "ai_success":
        return { icon: ShieldCheck, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "action":
        return { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      default:
        return { icon: Clock, color: "text-slate-400 bg-slate-800 border-slate-700" };
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {timeline.map((item, index) => {
        const { icon: ItemIcon, color } = getIcon(item.type);

        return (
          <div key={item.id || index} className="relative group">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-6 top-0.5 flex items-center justify-center w-5 h-5 rounded-full border text-xs ${color}`}
            >
              <ItemIcon className="w-3 h-3" />
            </div>

            {/* Content card */}
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-3.5 hover:bg-slate-900/80 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  {item.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {item.description}
              </p>
              {item.author && (
                <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <span>Source:</span>
                  <span className="text-slate-400">{item.author}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
