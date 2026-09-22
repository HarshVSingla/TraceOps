
export function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) {
  const variantStyles = {
    // Severity
    critical: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    p0: "bg-rose-500/15 text-rose-400 border-rose-500/40 font-semibold",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    p1: "bg-amber-500/15 text-amber-400 border-amber-500/40 font-semibold",
    medium: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    p2: "bg-sky-500/15 text-sky-400 border-sky-500/40",
    low: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    p3: "bg-slate-500/10 text-slate-400 border-slate-500/30",

    // Status
    healthy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    degraded: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    down: "bg-rose-500/15 text-rose-400 border-rose-500/40",
    investigating: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    active: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    mitigated: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",

    // AI & Special
    ai: "bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-xs shadow-purple-500/20",
    neutral: "bg-slate-800/60 text-slate-300 border-slate-700/60",
  };

  const dotColors = {
    critical: "bg-rose-400",
    p0: "bg-rose-400",
    high: "bg-amber-400",
    p1: "bg-amber-400",
    medium: "bg-sky-400",
    p2: "bg-sky-400",
    low: "bg-slate-400",
    p3: "bg-slate-400",
    healthy: "bg-emerald-400",
    degraded: "bg-amber-400",
    down: "bg-rose-500",
    investigating: "bg-cyan-400 animate-pulse",
    active: "bg-rose-400 animate-pulse",
    mitigated: "bg-indigo-400",
    resolved: "bg-emerald-400",
    ai: "bg-purple-400 animate-pulse",
    neutral: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium tracking-wide",
    md: "text-xs px-2.5 py-1 font-medium",
    lg: "text-sm px-3 py-1.5 font-medium",
  };

  const selectedVariant = variantStyles[variant.toLowerCase()] || variantStyles.neutral;
  const dotColor = dotColors[variant.toLowerCase()] || dotColors.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono uppercase ${selectedVariant} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      <span>{children}</span>
    </span>
  );
}
