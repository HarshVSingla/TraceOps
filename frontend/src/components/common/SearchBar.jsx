import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  shortcut = "⌘K",
  onClear,
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900/80 border border-slate-800 text-slate-200 text-xs md:text-sm rounded-lg pl-9 pr-12 py-2 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcut ? (
        <kbd className="absolute right-3 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-xs">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
}
