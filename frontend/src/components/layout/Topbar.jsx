import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Bell,
  Clock,
  Globe,
  Menu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../common/Button";

export function Topbar({ onOpenCommandPalette, onMobileMenuToggle }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 1h");
  const [selectedEnv, setSelectedEnv] = useState("prod-us-east-1");
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const timeframes = ["Last 15m", "Last 1h", "Last 6h", "Last 24h"];
  const environments = [
    { id: "prod-us-east-1", label: "Production (us-east-1)" },
    { id: "staging-eu-west-1", label: "Staging (eu-west-1)" },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left side: Mobile Toggle & Quick Search Trigger */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search shortcut button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors text-xs w-48 sm:w-64 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="flex-1 text-left truncate">Search incidents, logs...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Environment, Timeframe, AI Action, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Environment Picker */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs"
          >
            {environments.map((env) => (
              <option key={env.id} value={env.id} className="bg-slate-900 text-slate-200">
                {env.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe Picker */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs"
          >
            {timeframes.map((tf) => (
              <option key={tf} value={tf} className="bg-slate-900 text-slate-200">
                {tf}
              </option>
            ))}
          </select>
        </div>

        <Button
          size="sm"
          variant="ai"
          icon={Sparkles}
          onClick={() => navigate("/simulator")}
          className="text-xs"
        >
          <span className="hidden sm:inline">Simulation Lab</span>
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-3 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-200">Alert Feed</span>
                <span className="text-[10px] font-mono text-rose-400">1 Unresolved P1</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>INC-001 High Latency Triggered</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  payment-api response time exceeded 5,000ms. AI agents dispatched.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>INC-004 Mitigated</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Redis replica replication lag stabilized.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SRE User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-slate-100 flex items-center justify-center font-bold text-xs shadow-inner">
            AR
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              Alex Rivera
            </div>
            <div className="text-[10px] font-mono text-slate-400 leading-tight">
              Lead SRE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
