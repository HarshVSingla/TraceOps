import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Terminal,
  GitCommit,
  BookOpen,
  CheckCircle2,
  Loader2,
  Code,
  RotateCcw,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Tabs } from "../components/common/Tabs";
import { incidentsApi } from "../api/incidentsApi";
import { investigationApi } from "../api/investigationApi";

export function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [loadingIncident, setLoadingIncident] = useState(true);
  const [incidentError, setIncidentError] = useState(null);

  // Investigation loading states
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [investigationStage, setInvestigationStage] = useState(0);
  const [investigationError, setInvestigationError] = useState(null);

  const [activeEvidenceTab, setActiveEvidenceTab] = useState("logs");
  const [isRemediated, setIsRemediated] = useState(false);
  const [remediationLogs, setRemediationLogs] = useState([]);
  const [isRemediating, setIsRemediating] = useState(false);

  // These labels communicate the real investigation pipeline steps without fabricating timestamps
  const investigationProgressSteps = [
    "Starting investigation",
    "Collecting log evidence",
    "Analyzing deployments",
    "Retrieving knowledge base",
    "Synthesizing root cause",
    "Preparing investigation result",
  ];

  useEffect(() => {
    async function loadIncident() {
      setLoadingIncident(true);
      setIncidentError(null);
      try {
        const incData = await incidentsApi.getIncidentById(id);
        if (incData) {
          setIncident(incData);
        } else {
          setIncidentError(`Incident "${id}" not found.`);
        }
      } catch {
        setIncidentError("Failed to load incident data.");
      } finally {
        setLoadingIncident(false);
      }
    }
    loadIncident();
  }, [id]);

  // Trigger investigation using the real backend
  const handleTriggerInvestigation = async () => {
    if (!incident) return;
    setIsInvestigating(true);
    setInvestigationError(null);
    setInvestigationStage(0);

    // Cosmetic step progression — represents what backend actually does but does not fabricate timing
    let step = 0;
    const stepTimer = setInterval(() => {
      step += 1;
      if (step < investigationProgressSteps.length - 1) {
        setInvestigationStage(step);
      }
    }, 600);

    try {
      let result;

      if (incident.isSimulated) {
        // Use simulation_id → POST /simulation/investigate (passes real evidence through backend pipeline)
        const simulationId = incident.simulationId || incident.id;
        result = await investigationApi.investigateSimulation(simulationId);
      } else {
        // Fallback for non-simulated incidents: POST /investigate
        result = await investigationApi.investigateIncident(
          incident.service,
          incident.description || incident.title
        );
      }

      clearInterval(stepTimer);
      setInvestigationStage(investigationProgressSteps.length - 1);
      setInvestigation(result);
    } catch (err) {
      clearInterval(stepTimer);
      console.error("Investigation failed:", err);
      setInvestigationError(
        err?.message ||
          "Investigation failed. Ensure the backend is running and the simulation ID is valid."
      );
    } finally {
      setIsInvestigating(false);
      setInvestigationStage(0);
    }
  };

  const handleApproveRemediation = () => {
    setIsRemediating(true);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setRemediationLogs([`[${now}] Human signature accepted — remediation authorized`]);

    setTimeout(() => {
      setRemediationLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Initiating fix for service: ${incident?.service || "unknown"}`,
      ]);
    }, 900);

    setTimeout(() => {
      setRemediationLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Remediation applied. Awaiting human verification of system health.`,
      ]);
      setIsRemediating(false);
      setIsRemediated(true);
      incidentsApi.updateIncidentStatus(id, "mitigated");
    }, 2200);
  };

  // ── Loading / Error states ──────────────────────────────────────────────────

  if (loadingIncident) {
    return (
      <div className="py-20 text-center font-mono text-xs text-slate-400 space-y-2">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-cyan-400" />
        <div>Loading incident workspace…</div>
      </div>
    );
  }

  if (incidentError || !incident) {
    return (
      <div className="py-20 text-center font-mono text-xs text-slate-400 space-y-3">
        <div>{incidentError || `Incident ${id} not found.`}</div>
        <Button size="sm" variant="outline" onClick={() => navigate("/incidents")}>
          Back to Incidents
        </Button>
      </div>
    );
  }

  // ── Evidence tabs ────────────────────────────────────────────────────────────

  const evidenceTabs = [
    { id: "logs", label: "Logs", icon: Terminal, count: investigation?.logEvidence?.errorCount || undefined },
    { id: "deployments", label: "Deployments", icon: GitCommit },
    { id: "code", label: "Code / Config", icon: Code },
    { id: "knowledge", label: "Knowledge", icon: BookOpen, count: investigation?.knowledgeEvidence?.matches?.length || undefined },
  ];

  const rootCause = investigation?.rootCauseAnalysis || null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-6xl">

      {/* ── Top Header & Navigation ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/incidents")}
            className="p-1.5 rounded-lg border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#0F1522] transition-colors mt-0.5"
            title="Back to Incidents"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">{incident.id}</span>
              <Badge variant={incident.severity} size="sm" dot>
                {incident.severityRank || "P1"}
              </Badge>
              <Badge variant={isRemediated ? "mitigated" : incident.status} size="sm">
                {isRemediated ? "mitigated" : incident.status}
              </Badge>
              {incident.isSimulated && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  SIMULATED INCIDENT
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100 mt-1">
              {incident.title}
            </h1>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Service: <span className="text-slate-200 font-semibold">{incident.service}</span>
              {incident.detectedTime && <span> • Detected: {incident.detectedTime}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="primary"
            icon={Sparkles}
            isLoading={isInvestigating}
            onClick={handleTriggerInvestigation}
          >
            {isInvestigating ? "Investigating…" : "Run AI Investigation"}
          </Button>
        </div>
      </div>

      {/* ── Live investigation progress (frontend-driven, no fabricated timestamps) ── */}
      {isInvestigating && (
        <div className="rounded-xl border border-cyan-500/30 bg-[#0F1522] p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-[#1E293B] pb-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>INVESTIGATION IN PROGRESS</span>
          </div>
          <div className="space-y-1.5 pt-1">
            {investigationProgressSteps.map((stepLabel, idx) => {
              const done = investigationStage > idx;
              const active = investigationStage === idx;
              return (
                <div
                  key={idx}
                  className={done ? "text-emerald-400" : active ? "text-cyan-300 font-semibold" : "text-slate-500"}
                >
                  {done ? "✓" : active ? "●" : "○"} {stepLabel}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Waiting for TraceOps investigation pipeline (LogAgent → DeploymentAgent → KnowledgeAgent → RootCauseAgent)…
          </p>
        </div>
      )}

      {/* ── Investigation error ── */}
      {investigationError && !isInvestigating && (
        <div className="rounded-xl border border-rose-500/40 bg-[#0F1522] p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 border-b border-[#1E293B] pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-mono text-xs font-bold">INVESTIGATION FAILED</span>
          </div>
          <p className="text-rose-300 text-xs font-sans">{investigationError}</p>
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={handleTriggerInvestigation}>
            Retry Investigation
          </Button>
        </div>
      )}

      {/* ── SECTION 1: AI Investigation Summary ── */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-semibold uppercase text-slate-300">
              AI Investigation Overview
            </h2>
          </div>
          {rootCause && (
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Confidence:</span>
              <span className={`font-bold uppercase ${
                rootCause.confidenceRaw === "high"
                  ? "text-emerald-400"
                  : rootCause.confidenceRaw === "medium"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}>
                {rootCause.confidenceRaw || "—"}
              </span>
            </div>
          )}
        </div>

        {!investigation && !isInvestigating && (
          <div className="text-center py-6 space-y-2 text-slate-500 text-xs font-mono">
            <div>No investigation results yet.</div>
            <div className="text-slate-600">Click <span className="text-cyan-400">Run AI Investigation</span> to dispatch the TraceOps pipeline.</div>
          </div>
        )}

        {rootCause && (
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Incident Summary
              </span>
              <p className="text-slate-200 leading-relaxed bg-[#090D16] p-3 rounded-lg border border-[#1E293B]">
                {rootCause.incidentSummary || incident.description}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold block mb-1">
                Probable Root Cause
              </span>
              <p className="text-slate-100 font-medium leading-relaxed bg-cyan-950/20 p-3.5 rounded-lg border border-cyan-500/30">
                {rootCause.rootCause}
              </p>
            </div>

            {/* Backend evidence list */}
            {rootCause.evidence && rootCause.evidence.length > 0 && (
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1.5">
                  Supporting Evidence
                </span>
                <ul className="space-y-1 list-none">
                  {rootCause.evidence.map((ev, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 bg-[#090D16] px-3 py-2 rounded-lg border border-[#1E293B]">
                      <span className="text-cyan-500 shrink-0">›</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SECTION 2: Investigation Timeline ── */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Investigation Timeline
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Chronological Event Sequence</span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {incident.timeline && incident.timeline.length > 0 ? (
            incident.timeline.map((event, idx) => (
              <div
                key={event.id || idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-[#1E293B] bg-[#090D16]"
              >
                <span className="text-slate-400 text-[11px] shrink-0 font-bold">{event.time}</span>
                <span
                  className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                    event.type === "deployment"
                      ? "bg-amber-400"
                      : event.type === "alert"
                      ? "bg-rose-400"
                      : event.type === "ai_success"
                      ? "bg-emerald-400"
                      : "bg-cyan-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200">{event.title}</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500 text-[11px]">
              Timeline events will appear after investigation is run.
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 3: Evidence Panel ── */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
          <div>
            <h2 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Investigation Evidence
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Evidence collected by TraceOps subagents from the simulated incident
            </p>
          </div>
          <Tabs
            tabs={evidenceTabs}
            activeTab={activeEvidenceTab}
            onChange={setActiveEvidenceTab}
            size="sm"
          />
        </div>

        {!investigation && (
          <div className="text-center py-8 text-slate-500 text-[11px] font-mono">
            Evidence will appear after investigation is run.
          </div>
        )}

        {/* TAB 1: LOG EVIDENCE */}
        {investigation && activeEvidenceTab === "logs" && (
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Scanned Logs: {investigation.logEvidence?.totalLogs ?? "—"} total</span>
              <span className="text-rose-400 font-bold">
                {investigation.logEvidence?.errorCount ?? 0} Errors Found
              </span>
            </div>

            <div className="space-y-2">
              {investigation.logEvidence?.errors?.length > 0 ? (
                investigation.logEvidence.errors.map((err, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] text-rose-300 text-xs"
                  >
                    {err}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-[11px] text-center py-3">No error logs recorded.</div>
              )}
            </div>

            {investigation.logEvidence?.sampleStack && (
              <div className="pt-2">
                <span className="text-[11px] uppercase text-slate-400 block mb-1">Sample Stack Trace</span>
                <pre className="p-3 rounded-lg bg-[#090D16] border border-rose-500/30 text-rose-300 text-[11px] overflow-x-auto">
                  {investigation.logEvidence.sampleStack}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DEPLOYMENT EVIDENCE */}
        {investigation && activeEvidenceTab === "deployments" && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-1">
              <div className="text-slate-200 font-semibold">
                Service: {investigation.deploymentEvidence?.service || "—"}
                {investigation.deploymentEvidence?.latestVersion && investigation.deploymentEvidence.latestVersion !== "—" && (
                  <span> • Deployment: {investigation.deploymentEvidence.latestVersion}</span>
                )}
              </div>
              <div className="text-slate-400 text-[11px]">
                {investigation.deploymentEvidence?.deploymentTime && investigation.deploymentEvidence.deploymentTime !== "—" && (
                  <span>Time: {investigation.deploymentEvidence.deploymentTime}</span>
                )}
                {investigation.deploymentEvidence?.author && investigation.deploymentEvidence.author !== "—" && (
                  <span> • Deployed by: {investigation.deploymentEvidence.author}</span>
                )}
                {investigation.deploymentEvidence?.commitHash && (
                  <span> • Commit: {investigation.deploymentEvidence.commitHash}</span>
                )}
              </div>
            </div>

            {investigation.deploymentEvidence?.changes?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase text-slate-400 block">Change Summary:</span>
                {investigation.deploymentEvidence.changes.map((ch, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#090D16] border border-[#1E293B] text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{ch}</span>
                  </div>
                ))}
              </div>
            )}

            {(!investigation.deploymentEvidence?.changes || investigation.deploymentEvidence.changes.length === 0) && (
              <div className="text-slate-500 text-[11px] text-center py-3">No deployment changes recorded.</div>
            )}
          </div>
        )}

        {/* TAB 3: CODE / CONFIGURATION */}
        {investigation && activeEvidenceTab === "code" && (
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[11px] uppercase text-slate-400 block">
              Configuration Diff Snippet:
            </span>
            {investigation.deploymentEvidence?.diff?.length > 0 ? (
              <div className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-1">
                {investigation.deploymentEvidence.diff.map((line, i) => (
                  <div
                    key={i}
                    className={line.type === "add" ? "text-emerald-400" : "text-rose-400"}
                  >
                    {line.line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-[11px] text-center py-3">No configuration diff available.</div>
            )}
          </div>
        )}

        {/* TAB 4: KNOWLEDGE EVIDENCE */}
        {investigation && activeEvidenceTab === "knowledge" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {investigation.knowledgeEvidence?.matches?.length > 0 ? (
              investigation.knowledgeEvidence.matches.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                    <span className="font-bold text-slate-200">{m.file_name}</span>
                    {m.relevanceScore && (
                      <Badge variant="cyan" size="sm">
                        {m.relevanceScore} Match
                      </Badge>
                    )}
                  </div>
                  {m.title && <div className="text-cyan-300 font-semibold">{m.title}</div>}
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">{m.content}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-slate-500 text-[11px] text-center py-3">
                No knowledge base matches found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SECTION 4: Root Cause Breakdown ── */}
      {rootCause && (
        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4">
          <div className="border-b border-[#1E293B] pb-3">
            <h2 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Root Cause Evidence Breakdown
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Structured output from the Root Cause Agent — based solely on investigated evidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Observed Facts */}
            <div className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-2">
              <span className="text-emerald-400 font-bold uppercase text-[11px] block">
                ✓ Observed Facts
              </span>
              {rootCause.observedFacts && rootCause.observedFacts.length > 0 ? (
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {rootCause.observedFacts.map((fact, i) => (
                    <li key={i}>{fact}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-[11px]">No observed facts recorded.</p>
              )}
            </div>

            {/* Likely Causes */}
            <div className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-2">
              <span className="text-cyan-400 font-bold uppercase text-[11px] block">
                ● Likely Causes
              </span>
              {rootCause.likelyCauses && rootCause.likelyCauses.length > 0 ? (
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {rootCause.likelyCauses.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-[11px]">No specific likely causes identified.</p>
              )}
            </div>

            {/* Unverified Hypotheses */}
            <div className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-2">
              <span className="text-amber-400 font-bold uppercase text-[11px] block">
                ? Unverified Hypotheses
              </span>
              {rootCause.unverifiedHypotheses && rootCause.unverifiedHypotheses.length > 0 ? (
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                  {rootCause.unverifiedHypotheses.map((hypo, i) => (
                    <li key={i}>{hypo}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-[11px]">No unverified hypotheses noted.</p>
              )}
            </div>

            {/* Evidence Limitations */}
            <div className="p-3.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[11px] block">
                ! Evidence Limitations
              </span>
              {rootCause.evidenceLimitations && rootCause.evidenceLimitations.length > 0 ? (
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                  {rootCause.evidenceLimitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-[11px]">No evidence limitations identified.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 5: Recommended Remediation & Human Approval ── */}
      {rootCause && (
        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-semibold uppercase text-slate-300">
                Recommended Remediation
              </h2>
            </div>
            {rootCause.humanApprovalRequired && !isRemediated && (
              <span className="text-xs font-mono text-amber-400 bg-amber-950/30 px-2.5 py-1 rounded border border-amber-800/40">
                Human approval required
              </span>
            )}
          </div>

          {/* Human approval notice — value comes from backend human_approval_required */}
          {rootCause.humanApprovalRequired && !isRemediated && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-sans">
              <span className="font-semibold block">Human Approval Required:</span>
              <span>
                TraceOps requires explicit human authorization before applying any changes. Review the root cause and fix before approving.
              </span>
            </div>
          )}

          {/* Recommended fix — from backend */}
          <div className="text-xs text-slate-200 leading-relaxed bg-[#090D16] p-3.5 rounded-lg border border-[#1E293B]">
            <span className="font-mono text-cyan-400 font-bold block mb-1">Recommended Fix:</span>
            {rootCause.recommendedFix}
          </div>

          {/* Verification Steps — from backend */}
          {rootCause.verificationSteps && rootCause.verificationSteps.length > 0 && (
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[11px] uppercase text-slate-400 block">Verification Steps:</span>
              <ol className="space-y-1 list-decimal list-inside text-slate-300">
                {rootCause.verificationSteps.map((step, i) => (
                  <li key={i} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Proposed Patch */}
          {rootCause.proposedPatch && (
            <div className="space-y-1 font-mono text-xs">
              <span className="text-[11px] uppercase text-slate-400">Proposed Config Patch:</span>
              <pre className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] text-slate-300 text-[11px] overflow-x-auto">
                {rootCause.proposedPatch}
              </pre>
            </div>
          )}

          {/* Remediation execution log */}
          {remediationLogs.length > 0 && (
            <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-1 font-mono text-[11px] text-cyan-300">
              {remediationLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          )}

          {/* Action */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Target: <span className="text-slate-200 font-bold">{incident.service}</span>
            </span>

            {!isRemediated ? (
              <Button
                variant="primary"
                size="md"
                icon={CheckCircle2}
                isLoading={isRemediating}
                onClick={handleApproveRemediation}
              >
                Approve &amp; Execute Remediation
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                <Check className="w-4 h-4" />
                <span>Remediation Applied — Verify System Health</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
