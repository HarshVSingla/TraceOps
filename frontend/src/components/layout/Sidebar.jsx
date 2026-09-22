import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

export function Sidebar({ isCollapsed, onToggle }) {
  const navItems = [
    {
      to: "/overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      to: "/incidents",
      label: "Incidents",
      icon: AlertTriangle,
    },
    {
      to: "/simulator",
      label: "Simulation Lab",
      icon: FlaskConical,
      badge: "DRILL",
      badgeVariant: "cyan",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-[#090D16] border-r border-[#1E293B] flex flex-col transition-all duration-300 select-none ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#1E293B]">
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-sm tracking-tight font-mono">
                TRACEOPS
              </span>
            </div>
          )}
        </Link>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggle}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-slate-200 hover:bg-[#0F1522] transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors group ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0F1522] border border-transparent"
                } ${isCollapsed ? "justify-center px-0" : ""}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />

              {!isCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider & Settings */}
      <div className="px-2.5 py-2 border-t border-[#1E293B] space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
              isActive
                ? "bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#0F1522] border border-transparent"
            } ${isCollapsed ? "justify-center px-0" : ""}`
          }
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </div>

      {/* Bottom Status Panel */}
      <div className="p-3 border-t border-[#1E293B] bg-[#090D16]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">System Operational</span>
          </div>
        ) : (
          <div className="flex justify-center" title="System Operational">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          </div>
        )}
      </div>
    </aside>
  );
}
