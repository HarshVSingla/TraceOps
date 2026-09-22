import { Link } from "react-router-dom";
import { ScrollText, ArrowUpRight } from "lucide-react";
import { Card } from "../common/Card";
import { mockLogs } from "../../data/mockLogs";


export function QuickLogsStream() {
  const recentLogs = mockLogs.slice(0, 6);

  return (
    <Card
      title="Live Telemetry &amp; Log Ingestion"
      subtitle="Streaming recent container events &amp; error traces"
      icon={ScrollText}
      action={
        <Link
          to="/logs"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>Open Explorer</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      }
      bodyClassName="p-0"
    >
      <div className="divide-y divide-slate-800/60 font-mono text-xs max-h-96 overflow-y-auto">
        {recentLogs.map((log) => {
          const isError = log.level === "ERROR";
          const isWarn = log.level === "WARN";

          return (
            <div
              key={log.id}
              className="p-3 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-baseline gap-2"
            >
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400">
                  {log.timestamp.split(" ")[1]}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isError
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : isWarn
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-cyan-400/90 text-[11px] font-medium">
                  [{log.service}]
                </span>
              </div>
              <p
                className={`truncate flex-1 text-xs ${
                  isError
                    ? "text-rose-200 font-medium"
                    : isWarn
                    ? "text-amber-200"
                    : "text-slate-300"
                }`}
                title={log.message}
              >
                {log.message}
              </p>
              {log.durationMs && (
                <span className="text-[11px] text-slate-400 shrink-0 sm:ml-auto">
                  {log.durationMs}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
