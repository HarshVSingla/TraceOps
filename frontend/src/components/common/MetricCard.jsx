import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function MetricCard({
  label,
  value,
  subValue,
  change,
  changeType = "neutral", // 'positive', 'negative', 'neutral'
  status = "healthy", // 'healthy', 'warning', 'critical'
  sparkline = [],
  icon: Icon,
  className = "",
  onClick,
}) {
  const statusBorders = {
    healthy: "border-slate-800/80 hover:border-emerald-500/30",
    warning: "border-amber-500/30 bg-amber-950/10",
    critical: "border-rose-500/30 bg-rose-950/10",
  };

  const changeColors = {
    positive: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    negative: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    neutral: "text-slate-400 bg-slate-800 border-slate-700",
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border bg-slate-900/60 p-4 transition-all duration-200 ${
        statusBorders[status] || statusBorders.healthy
      } ${onClick ? "cursor-pointer hover:bg-slate-900/90" : ""} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase font-mono">
          {label}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-100">
            {value}
          </div>
          {subValue && (
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              {subValue}
            </div>
          )}
        </div>

        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-md border font-mono font-medium ${
              changeColors[changeType] || changeColors.neutral
            }`}
          >
            {changeType === "negative" ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : changeType === "positive" ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>

      {/* Mini SVG Sparkline */}
      {sparkline && sparkline.length > 1 && (
        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Last 30m</span>
          <svg className="w-24 h-6 overflow-visible" viewBox="0 0 100 24">
            {(() => {
              const min = Math.min(...sparkline);
              const max = Math.max(...sparkline) || 1;
              const range = max - min || 1;
              const points = sparkline
                .map((val, idx) => {
                  const x = (idx / (sparkline.length - 1)) * 100;
                  const y = 20 - ((val - min) / range) * 16;
                  return `${x},${y}`;
                })
                .join(" ");

              const strokeColor =
                status === "critical"
                  ? "#f43f5e"
                  : status === "warning"
                  ? "#fbbf24"
                  : "#10b981";

              return (
                <>
                  <polyline
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {/* Last point pulse */}
                  {sparkline.length > 0 && (
                    <circle
                      cx="100"
                      cy={20 - ((sparkline[sparkline.length - 1] - min) / range) * 16}
                      r="2.5"
                      fill={strokeColor}
                    />
                  )}
                </>
              );
            })()}
          </svg>
        </div>
      )}
    </div>
  );
}
