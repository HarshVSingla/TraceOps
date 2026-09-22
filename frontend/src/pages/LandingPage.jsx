import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
  Terminal,
  GitCommit,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { LandingNav } from "../components/layout/LandingNav";
import { Button } from "../components/common/Button";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>AI Incident Investigation Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 max-w-3xl mx-auto leading-tight font-sans">
          AI-Powered Incident Investigation
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
          TraceOps correlates production telemetry, git deployments, and operational runbooks to identify probable root causes and propose human-verified remediations.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            iconRight={ArrowRight}
            onClick={() => navigate("/overview")}
          >
            Launch Console
          </Button>
          <Button
            size="lg"
            variant="outline"
            icon={FlaskConical}
            onClick={() => navigate("/simulator")}
          >
            Run Simulation
          </Button>
        </div>
      </section>

      {/* Core User Journey Flow Section */}
      <section className="py-24 border-t border-[#1E293B] bg-[#0F1522]/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-sm font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Investigation Architecture
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-slate-100 font-sans">
              TraceOps Multi-Agent Investigation Engine
            </h3>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Autonomous subagents synthesize evidence across system telemetry layers to deliver deterministic root cause conclusions.
            </p>
          </div>

          {/* Clean Product-Oriented Pipeline Flow */}
          <div className="rounded-2xl border border-[#1E293B] bg-[#090D16] p-8 space-y-6">
            <div className="text-center text-xs font-mono font-bold text-slate-300 uppercase tracking-widest pb-4 border-b border-[#1E293B]">
              TraceOps Investigation Pipeline
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-stretch">
              {/* Stage 1: Logs */}
              <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F1522] flex flex-col justify-between space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wide">1. Logs</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Log Agent extracts error anomalies, stack trace frames, and latency spikes.
                </p>
                <div className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-800/40 text-center">
                  Runtime Log Agent
                </div>
              </div>

              {/* Stage 2: Deployments */}
              <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F1522] flex flex-col justify-between space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wide">2. Deployments</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Deployment Agent correlates recent git commits, manifest diffs, and version releases.
                </p>
                <div className="text-xs font-mono text-purple-300 bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-800/40 text-center">
                  Git &amp; Config Agent
                </div>
              </div>

              {/* Stage 3: Knowledge */}
              <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F1522] flex flex-col justify-between space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-200 uppercase tracking-wide">3. Knowledge</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-sans">
                  Knowledge Agent queries operational runbooks, RAG indexes, and past incidents.
                </p>
                <div className="text-xs font-mono text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-800/40 text-center">
                  Runbook RAG Agent
                </div>
              </div>

              {/* Stage 4: Root Cause Analysis */}
              <div className="p-6 rounded-xl border border-emerald-500/40 bg-emerald-950/10 flex flex-col justify-between space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-300 uppercase tracking-wide">4. Root Cause</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-sans">
                  Root Cause Agent synthesizes evidence into verified conclusions &amp; remediation plans.
                </p>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50 text-center font-bold">
                  Root Cause Synthesis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1E293B] bg-[#090D16] py-6 text-center text-xs text-slate-500 font-mono">
        <div>TraceOps AI Incident Investigation Platform &copy; 2026</div>
      </footer>
    </div>
  );
}
