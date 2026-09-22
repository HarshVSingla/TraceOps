import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  AlertTriangle,
  Sparkles,
  Server,
  Settings,
  ArrowRight,
  X,
} from "lucide-react";
import { mockIncidents } from "../../data/mockIncidents";
import { mockServices } from "../../data/mockServices";

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPages = [
    { label: "Operations Overview", path: "/overview", icon: LayoutDashboard, category: "Navigation" },
    { label: "Incidents Console", path: "/incidents", icon: AlertTriangle, category: "Navigation" },
    { label: "Simulation Lab Drill", path: "/simulator", icon: Sparkles, category: "Testing" },
    { label: "Settings & Configuration", path: "/settings", icon: Settings, category: "Settings" },
  ].filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

  const filteredIncidents = mockIncidents
    .filter(
      (inc) =>
        inc.id.toLowerCase().includes(query.toLowerCase()) ||
        inc.title.toLowerCase().includes(query.toLowerCase()) ||
        inc.service.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const filteredServices = mockServices
    .filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.runtime.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const handleSelect = (path) => {
    navigate(path);
    onClose(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={() => onClose(false)}
      />
      <div className="relative w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl z-10 overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, incident ID, or service name..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onClose(false)}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Navigation Section */}
          {filteredPages.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-slate-400">
                Pages & Views
              </div>
              <div className="space-y-0.5">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                        <span>{page.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Incidents Section */}
          {filteredIncidents.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-slate-400">
                Incidents
              </div>
              <div className="space-y-0.5">
                {filteredIncidents.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => handleSelect(`/incidents/${inc.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-cyan-400 shrink-0">
                        {inc.id}
                      </span>
                      <span className="truncate text-slate-300">
                        {inc.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 shrink-0 ml-2 font-mono">
                      {inc.service}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {filteredServices.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-slate-400">
                Microservices
              </div>
              <div className="space-y-0.5">
                {filteredServices.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleSelect(`/services`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono">{svc.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {svc.runtime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 &&
            filteredIncidents.length === 0 &&
            filteredServices.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500">
                No matching results found for "{query}"
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 px-4 py-2 text-[11px] text-slate-500 font-mono">
          <span>Navigate with ↵ Enter</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
