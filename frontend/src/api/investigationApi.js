const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const investigationApi = {
  /**
   * Investigates a simulated incident by passing simulation_id to backend POST /simulation/investigate
   */
  async investigateSimulation(simulationId) {
    if (!simulationId) {
      throw new Error("Simulation ID is required for investigation.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/simulation/investigate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          simulation_id: simulationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return this.normalizeBackendResult(data.investigation || data, simulationId);
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Backend investigation failed with status ${response.status}`);
      }
    } catch (err) {
      console.error("Error in investigateSimulation:", err);
      throw err;
    }
  },

  /**
   * Generic/Legacy endpoint caller POST /investigate
   */
  async investigateIncident(service, incidentDescription) {
    try {
      const response = await fetch(`${API_BASE_URL}/investigate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: service || "payment-api",
          incident_description: incidentDescription || "API response time increased.",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return this.normalizeBackendResult(data, service);
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Backend error: ${response.status}`);
      }
    } catch (err) {
      console.error("Backend /investigate error:", err);
      throw err;
    }
  },

  /**
   * Normalizes backend response into a structured object for UI rendering.
   *
   * Exact backend field mapping (verified from agent source):
   *
   * LogAgent.analyze() returns:
   *   { status, total_logs, error_count, errors: [{timestamp_utc, level, message}] }
   *
   * DeploymentAgent.analyze(service) returns:
   *   { status, service, deployment_id, deployment_time, deployed_by,
   *     changes (string — the raw change_summary), commit_id, deployment_status }
   *
   * KnowledgeAgent.search() returns:
   *   { status, query, matches: [{file_name, content}] }
   *
   * RootCauseAgent.analyze() returns:
   *   { incident_summary, root_cause, confidence, evidence[], recommended_fix,
   *     verification_steps[], human_approval_required }
   */
  normalizeBackendResult(raw) {
    const rootCause = raw.root_cause_analysis || {};

    // ── Log Evidence ────────────────────────────────────────────────
    const logEv = raw.log_evidence || {};
    const rawErrors = logEv.errors || [];

    // Backend errors are full log objects {timestamp_utc, level, message}
    // Render them as readable strings for the UI
    const formattedErrors = rawErrors.map((e) => {
      if (typeof e === "string") return e;
      const ts = e.timestamp_utc || "";
      const msg = e.message || JSON.stringify(e);
      return ts ? `[${ts}] ${msg}` : msg;
    });

    // ── Deployment Evidence ─────────────────────────────────────────
    const depEv = raw.deployment_evidence || {};
    // DeploymentAgent.changes is the raw change_summary string (not an array)
    const deploymentChanges = Array.isArray(depEv.changes)
      ? depEv.changes
      : depEv.changes
      ? [depEv.changes]
      : [];

    // ── Knowledge Evidence ──────────────────────────────────────────
    const knwEv = raw.knowledge_evidence || {};
    const knowledgeMatches = (knwEv.matches || []).map((m) => ({
      // KnowledgeAgent returns file_name and content (no title/relevanceScore)
      file_name: m.file_name || m.file || "runbook.md",
      title: m.title || m.file_name || m.file || "Operational Knowledge Match",
      relevanceScore: m.relevanceScore || null,
      content: m.content || "",
    }));

    return {
      incidentService: raw.incident_service || "",

      logEvidence: {
        totalLogs: logEv.total_logs ?? rawErrors.length,
        errorCount: logEv.error_count ?? rawErrors.length,
        errors: formattedErrors,
        sampleStack: logEv.sample_stack || null,
      },

      deploymentEvidence: {
        service: depEv.service || raw.incident_service || "",
        // DeploymentAgent doesn't return version info — show commit & deployment ID instead
        latestVersion: depEv.deployment_id || depEv.deployment_status || "—",
        previousVersion: null,
        deploymentTime: depEv.deployment_time || "—",
        // DeploymentAgent returns commit_id (not commit_hash)
        commitHash: depEv.commit_id || depEv.commit_simulated_id || null,
        // DeploymentAgent returns deployed_by (not author)
        author: depEv.deployed_by || "—",
        changes: deploymentChanges,
        diff: depEv.diff || [],
      },

      knowledgeEvidence: {
        matches: knowledgeMatches,
      },

      rootCauseAnalysis: {
        incidentSummary: rootCause.incident_summary || "",
        rootCause: rootCause.root_cause || "",
        confidenceRaw: rootCause.confidence || "medium",
        confidence: rootCause.confidence
          ? `${rootCause.confidence.toUpperCase()} Confidence`
          : "Medium Confidence",
        // evidence[] from RootCauseAgent — the primary supporting facts
        evidence: rootCause.evidence || [],
        // observedFacts / likelyCauses: derived from the backend evidence array
        // since the backend does not return these separate categories
        observedFacts: rootCause.evidence ? rootCause.evidence.slice(0, 2) : [],
        likelyCauses: rootCause.root_cause ? [rootCause.root_cause] : [],
        unverifiedHypotheses: [],
        evidenceLimitations:
          rootCause.confidence === "low"
            ? ["Evidence insufficient for high-confidence root cause determination"]
            : [],
        recommendedFix: rootCause.recommended_fix || "",
        verificationSteps: rootCause.verification_steps || [],
        humanApprovalRequired: rootCause.human_approval_required ?? true,
        proposedPatch: rootCause.proposed_patch || null,
      },
    };
  },
};
