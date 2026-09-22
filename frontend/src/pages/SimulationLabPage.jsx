import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  CheckCircle2,
  Loader2,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { simulationApi } from "../api/simulationApi";
import { mockServices } from "../data/mockServices";

export function SimulationLabPage() {
  const navigate = useNavigate();
  const categories = simulationApi.getCategories();

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedService, setSelectedService] = useState(categories[0].defaultService);

  // stage: 'idle' | 'running' | 'complete' | 'error'
  const [stage, setStage] = useState("idle");
  const [runningStep, setRunningStep] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // These steps mirror what the backend actually does (cosmetic progress indicator only)
  const simulationSteps = [
    "Dispatching Simulation Agent",
    "Generating controlled failure scenario",
    "Building runtime log evidence",
    "Generating deployment event",
    "Packaging investigation evidence",
    "Finalizing simulation output",
  ];

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      setSelectedService(cat.defaultService);
    }
  };

  const handleStartSimulation = async () => {
    setStage("running");
    setRunningStep(0);
    setSimResult(null);
    setErrorMessage(null);

    // Run a cosmetic progress animation in parallel with the real backend call
    // This does NOT fabricate backend data — it simply provides visual feedback
    const stepInterval = setInterval(() => {
      setRunningStep((prev) => {
        if (prev < simulationSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      // Call the REAL backend Simulation Agent
      const result = await simulationApi.generateSimulation({
        service: selectedService,
        category: selectedCategory,
      });

      clearInterval(stepInterval);
      setRunningStep(simulationSteps.length);
      setSimResult(result);
      setStage("complete");
    } catch (err) {
      clearInterval(stepInterval);
      console.error("Simulation failed:", err);
      setErrorMessage(
        err?.message ||
          "Simulation Agent could not generate the scenario. Check the backend is running on the configured URL."
      );
      setStage("error");
    }
  };

  const handleReset = () => {
    setStage("idle");
    setSimResult(null);
    setErrorMessage(null);
    setRunningStep(0);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            SIMULATION LAB
          </h1>
          <Badge variant="cyan" size="sm">
            CONTROLLED ENVIRONMENT
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Generate controlled simulated incidents via the backend Simulation Agent and investigate them with the TraceOps AI pipeline.
        </p>
      </div>

      {/* IDLE: Configuration Form */}
      {stage === "idle" && (
        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-5">
          <div className="border-b border-[#1E293B] pb-3">
            <h2 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Scenario Configuration
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the failure category and target service. The backend Simulation Agent will generate
              realistic evidence based on your selection.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Incident Category */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 font-mono">
                Incident Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200 font-semibold"
                        : "border-[#1E293B] bg-[#090D16] text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs">{cat.label}</span>
                      <Badge variant={cat.severity} size="sm">
                        {cat.severity}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Service */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5 font-mono">
                Target Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg p-2.5 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {mockServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              ● All generated evidence is tagged as{" "}
              <span className="text-cyan-400 font-bold">SIMULATED</span>
            </span>
            <Button
              variant="primary"
              size="md"
              icon={Play}
              onClick={handleStartSimulation}
            >
              Generate Incident
            </Button>
          </div>
        </div>
      )}

      {/* RUNNING: Progress indicator */}
      {stage === "running" && (
        <div className="rounded-xl border border-cyan-500/30 bg-[#0F1522] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-mono text-xs font-bold text-slate-100">
                GENERATING SIMULATION
              </span>
            </div>
            <Badge variant="cyan" size="sm">
              BACKEND AGENT RUNNING
            </Badge>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {simulationSteps.map((step, idx) => {
              const isDone = runningStep > idx;
              const isCurrent = runningStep === idx;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                    isDone
                      ? "border-emerald-500/30 bg-emerald-950/10 text-emerald-300"
                      : isCurrent
                      ? "border-cyan-500/40 bg-cyan-950/20 text-cyan-300 font-semibold"
                      : "border-[#1E293B]/50 bg-[#090D16]/50 text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 font-mono text-center">
            The Simulation Agent is generating realistic evidence. This may take 15–60 seconds.
          </p>
        </div>
      )}

      {/* ERROR: Backend failure */}
      {stage === "error" && (
        <div className="rounded-xl border border-rose-500/40 bg-[#0F1522] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span className="font-mono text-xs font-bold text-rose-300">
              SIMULATION FAILED
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs font-sans space-y-1">
            <span className="font-semibold block">Simulation could not be generated.</span>
            <span className="text-rose-400 block font-mono text-[11px]">{errorMessage}</span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono space-y-1">
            <div>Make sure the backend is running:</div>
            <div className="text-slate-400 bg-[#090D16] px-3 py-2 rounded border border-[#1E293B] font-mono">
              uvicorn backend.api.main:app --reload --port 8000
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleReset}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* COMPLETE: Real backend result */}
      {stage === "complete" && simResult && (
        <div className="rounded-xl border border-emerald-500/40 bg-[#0F1522] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-100">
                SIMULATION COMPLETE
              </span>
            </div>
            <Badge variant="healthy" size="sm">
              READY FOR INVESTIGATION
            </Badge>
          </div>

          {/* Key IDs from real backend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Simulation ID</span>
              <span className="font-bold text-cyan-400 mt-0.5 block truncate" title={simResult.simulationId}>
                {simResult.simulationId}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Service</span>
              <span className="font-bold text-slate-200 mt-0.5 block">{simResult.service}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B]">
              <span className="text-[10px] text-slate-400 uppercase block">Category</span>
              <span className="font-bold text-slate-200 mt-0.5 block truncate" title={simResult.category}>
                {simResult.category}
              </span>
            </div>
          </div>

          {/* Evidence packaged summary */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
              Evidence Packaged by Backend:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {simResult.evidencePackaged.map((ev, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#090D16] border border-[#1E293B] text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident description from the backend evidence */}
          {simResult.incident?.description && (
            <div className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] text-xs font-sans space-y-1">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Incident Description (from backend)</span>
              <p className="text-slate-200 leading-relaxed">{simResult.incident.description}</p>
            </div>
          )}

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Configure Another Scenario
            </Button>

            <Button
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              onClick={() => navigate(`/incidents/${simResult.simulationId}`)}
            >
              Start Investigation →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
