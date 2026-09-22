
export function Card({
  children,
  className = "",
  title,
  subtitle,
  icon: Icon,
  action,
  headerClassName = "",
  bodyClassName = "",
  hoverable = false,
  highlight = false,
  ...props
}) {
  return (
    <div
      className={`relative rounded-xl border bg-slate-900/70 backdrop-blur-xs transition-all duration-200 ${
        highlight
          ? "border-cyan-500/40 shadow-sm shadow-cyan-500/10"
          : "border-slate-800/80"
      } ${
        hoverable ? "hover:border-slate-700 hover:bg-slate-900/90" : ""
      } ${className}`}
      {...props}
    >
      {(title || subtitle || Icon || action) && (
        <div
          className={`flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5 ${headerClassName}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-cyan-400 border border-slate-700/60 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 ml-3">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
