import { Loader2 } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none rounded-lg cursor-pointer";

  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-xs shadow-cyan-500/20 border border-cyan-400/40",
    secondary:
      "bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 hover:border-slate-600",
    outline:
      "bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700/80 hover:border-slate-600",
    ghost:
      "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent",
    danger:
      "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-500/60 font-semibold",
    success:
      "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/60 font-semibold",
    ai: "bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:border-purple-400/60 shadow-xs shadow-purple-900/30 font-semibold",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-3.5 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
