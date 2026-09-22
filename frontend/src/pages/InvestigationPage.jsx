import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Sparkles,
  Terminal,
  GitCommit,
  BookOpen,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Tabs } from "../components/common/Tabs";
import { AgentFlowVisualizer } from "../components/investigation/AgentFlowVisualizer";
import { AgentChatConsole } from "../components/investigation/AgentChatConsole";
import { RootCauseCard } from "../components/incidents/RootCauseCard";
import { RemediationAction } from "../components/incidents/RemediationAction";
import { mockInvestigationScenarios } from "../data/mockInvestigations";
import { mockServices } from "../data/mockServices";

export function InvestigationPage() {
  const location = useLocation();
  const initialService = location.state?.service || "payment-api";
  const initialDesc =
    location.state?.description ||
    "API response time increased from 200ms to 5 seconds after a recent deployment.";

  const initialResult =
    mockInvestigationScenarios.find((s) => s.service === initialService)?.result ||
    mockInvestigationScenarios[0].result;

  const [service, setService] = useState(initialService);
  const [description, setDescription] = useState(initialDesc);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(4); // Default to finished on initial load for preview
  const [activeEvidenceTab, setActiveEvidenceTab] = useState("logs");
  const [result, setResult] = useState(initialResult);


  const handleSelectScenario = (scenario) => {
    setService(scenario.service);
    setDescription(scenario.description);
    setResult(scenario.result);
  };

  const runInvestigation = () => {
    setIsRunning(true);
    setCurrentStep(1); // Orchestrator

    setTimeout(() => {
      setCurrentStep(2); // Parallel Subagents
    }, 1200);

    setTimeout(() => {
      setCurrentStep(3); // Root Cause Synthesis
    }, 2400);

    setTimeout(() => {
      // Find matching mock scenario or fallback to first
      const matched =
        mockInvestigationScenarios.find((s) => s.service === service) ||
        mockInvestigationScenarios[0];
      setResult(matched.result);
      setCurrentStep(4); // Done
      setIsRunning(false);
    }, 3600);
  };

  const evidenceTabs = [
    { id: "logs", label: "Log Agent Evidence", icon: Terminal },
    { id: "deployments", label: "Deployment Agent Evidence", icon: GitCommit },
    { id: "knowledge", label: "Knowledge Agent Runbooks", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
              Autonomous AI Incident Investigation
            </h1>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/50">
              MULTI-AGENT CONSOLE
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Dispatch Log Agent, Deployment Agent, and Knowledge Agent to formulate an evidence-backed root cause.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="ai" size="md">
            Gemini 1.5 Pro SRE Engine
          </Badge>
        </div>
      </div>

      {/* Preset Scenarios Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 text-[11px] uppercase mr-1">
          Preset Drills:
        </span>
        {mockInvestigationScenarios.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => handleSelectScenario(sc)}
            className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              service === sc.service
                ? "bg-purple-950/40 border-purple-500/50 text-purple-300 font-semibold"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Investigation Input Form */}
      <Card bodyClassName="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runInvestigation();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-medium">
                Target Microservice
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                disabled={isRunning}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
              >
                {mockServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.tier})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-medium">
                Observed Incident Description / APM Alert
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isRunning}
                  placeholder="e.g. API response time increased from 200ms to 5 seconds after a recent deployment..."
                  className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2.5 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <Button
                  type="submit"
                  variant="ai"
                  size="md"
                  icon={Sparkles}
                  isLoading={isRunning}
                  disabled={isRunning}
                  className="shrink-0"
                >
                  {isRunning ? "Investigating..." : "Start Investigation"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Multi-Agent Flow Pipeline Graph */}
      <AgentFlowVisualizer
        currentStep={currentStep}
        isRunning={isRunning}
      />

      {/* Results Section */}
      {result && (
        <div className="space-y-6 pt-2">
          {/* Main Synthesized Root Cause Card */}
          <RootCauseCard investigation={result} />

          {/* Cross-Agent Evidence Explorer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-semibold text-slate-100 font-mono">
                Multi-Agent Evidence Dossier
              </h3>
              <Tabs
                tabs={evidenceTabs}
                activeTab={activeEvidenceTab}
                onChange={setActiveEvidenceTab}
                size="sm"
              />
            </div>

            {/* TAB: Log Evidence */}
            {activeEvidenceTab === "logs" && (
              <Card
                title="Log Agent Findings"
                subtitle={`Extracted ${result.log_evidence?.error_count || 0} error anomalies from ${result.incident_service}`}
                icon={Terminal}
              >
                <div className="space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">
                        Total Scanned Logs
                      </span>
                      <span className="text-lg font-bold text-slate-200">
                        {result.log_evidence?.total_logs}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40">
                      <span className="text-rose-400 block text-[10px] uppercase">
                        Identified Errors
                      </span>
                      <span className="text-lg font-bold text-rose-300">
                        {result.log_evidence?.error_count}
                      </span>
                    </div>
                  </div>

                  {/* Errors list */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-slate-400 text-[11px] uppercase block">
                      Chronological Error Traces:
                    </span>
                    {result.log_evidence?.errors?.map((err, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-slate-950 border border-slate-800 text-rose-300 text-xs"
                      >
                        {err}
                      </div>
                    ))}
                  </div>

                  {/* Stack trace */}
                  {result.log_evidence?.sample_stack && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-slate-400 text-[11px] uppercase block">
                        Sample Stack Trace Frame:
                      </span>
                      <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-rose-300 text-[11px] overflow-x-auto">
                        {result.log_evidence.sample_stack}
                      </pre>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* TAB: Deployment Evidence */}
            {activeEvidenceTab === "deployments" && (
              <Card
                title="Deployment Agent Audit"
                subtitle={`Correlated with ${result.deployment_evidence?.latest_version || "deployment"}`}
                icon={GitCommit}
              >
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-200 font-semibold">
                      Service: {result.deployment_evidence?.service} • Version:{" "}
                      {result.deployment_evidence?.latest_version} (Previous:{" "}
                      {result.deployment_evidence?.previous_version})
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Timestamp: {result.deployment_evidence?.deployment_time} • Commit:{" "}
                      {result.deployment_evidence?.commit_hash}
                    </div>
                  </div>

                  {/* Changes */}
                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[11px] uppercase block">
                      Manifest &amp; Code Changes:
                    </span>
                    {result.deployment_evidence?.changes?.map((ch, i) => (
                      <div
                        key={i}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{ch}</span>
                      </div>
                    ))}
                  </div>

                  {/* Diff */}
                  {result.deployment_evidence?.diff && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-slate-400 text-[11px] uppercase block">
                        Configuration Diff Snippet:
                      </span>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                        {result.deployment_evidence.diff.map((line, i) => (
                          <div
                            key={i}
                            className={
                              line.type === "add"
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }
                          >
                            {line.line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* TAB: Knowledge Evidence */}
            {activeEvidenceTab === "knowledge" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.knowledge_evidence?.matches?.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-indigo-500/30 bg-slate-900/60 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-mono text-xs text-indigo-300 font-bold">
                        {m.file_name}
                      </span>
                      <Badge variant="ai" size="sm">
                        {m.relevanceScore} Similarity
                      </Badge>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remediation & Human Approval */}
          <RemediationAction
            recommendedFix={result.root_cause_analysis?.recommended_fix}
            proposedPatch={result.root_cause_analysis?.proposed_patch}
            humanApprovalRequired={
              result.root_cause_analysis?.human_approval_required
            }
          />

          {/* Interactive Agent Chat Assistant */}
          <AgentChatConsole incidentService={service} />
        </div>
      )}
    </div>
  );
}
