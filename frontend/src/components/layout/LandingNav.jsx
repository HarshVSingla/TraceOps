import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../common/Button";

export function LandingNav() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-lg tracking-tight">
              TraceOps
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              SRE PLATFORM
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
          <a href="#agents" className="hover:text-slate-200 transition-colors">
            Agent System
          </a>
          <a href="#features" className="hover:text-slate-200 transition-colors">
            Capabilities
          </a>
          <a href="#architecture" className="hover:text-slate-200 transition-colors">
            Architecture
          </a>
          <Link to="/incidents" className="hover:text-slate-200 transition-colors">
            Live Incidents
          </Link>
          <Link to="/investigate" className="hover:text-slate-200 transition-colors flex items-center gap-1 text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            AI Console
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </Link>
          <Button
            size="sm"
            variant="primary"
            iconRight={ArrowRight}
            onClick={() => navigate("/dashboard")}
          >
            Open Dashboard
          </Button>
        </div>
      </div>
    </header>
  );
}
