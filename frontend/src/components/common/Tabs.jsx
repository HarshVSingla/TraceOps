
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = "",
  size = "md",
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-md transition-all duration-150 font-medium select-none cursor-pointer ${
              size === "sm"
                ? "text-xs px-2.5 py-1"
                : "text-xs md:text-sm px-3 py-1.5"
            } ${
              isActive
                ? "bg-slate-800 text-cyan-300 font-semibold shadow-xs border border-slate-700/80"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
