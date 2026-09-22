import { incidentsApi } from "./incidentsApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const simulationApi = {
  /**
   * Supported simulation categories aligned with backend
   */
  getCategories() {
    return [
      { id: "database_failure", label: "Database Connection Failure", defaultService: "payment-api", severity: "critical" },
      { id: "memory_leak", label: "Application Memory Leak (OOMKilled)", defaultService: "auth-service", severity: "high" },
      { id: "api_timeout", label: "Upstream API Timeout Cascade", defaultService: "api-gateway", severity: "high" },
      { id: "auth_failure", label: "JWT Certificate Rotation Failure", defaultService: "auth-service", severity: "medium" },
      { id: "bad_deployment", label: "Bad Deployment Config Drift", defaultService: "payment-api", severity: "critical" },
      { id: "config_error", label: "Connection Pool Saturation", defaultService: "postgres-cluster", severity: "medium" },
      { id: "dependency_failure", label: "Redis Replica Replication Lag", defaultService: "redis-cache", severity: "low" },
      { id: "disk_exhaustion", label: "Container Disk Space Exhaustion", defaultService: "order-worker", severity: "medium" },
    ];
  },

  /**
   * Triggers real backend simulation generation via POST /simulation/generate
   */
  async generateSimulation(config = {}) {
    const service_name = config.service || config.service_name || "payment-api";
    const incident_category = config.category || config.incident_category || "database_failure";
    const difficulty = config.difficulty || "easy";

    try {
      const response = await fetch(`${API_BASE_URL}/simulation/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_name,
          incident_category,
          difficulty,
          execution_required: true,
          include_code_diff: true,
          include_deployment_data: true,
          include_runtime_logs: true,
          max_code_tokens: 2000,
          max_fix_attempts: 3,
          expose_ground_truth: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const simId = data.simulation_id;
        const evidence = data.investigation_evidence || {};
        const catInfo = this.getCategories().find((c) => c.id === incident_category) || this.getCategories()[0];

        // Format simulated incident title and description from real backend response
        const title = `[SIMULATED] ${catInfo.label} on ${service_name}`;
        const description = evidence.deployment_event?.change_summary ||
          `Simulated ${incident_category} incident generated for microservice ${service_name}.`;

        const incident = await incidentsApi.createIncident({
          id: simId,
          simulationId: simId,
          isSimulated: true,
          title,
          service: service_name,
          severity: catInfo.severity,
          severityRank: catInfo.severity === "critical" ? "P0" : catInfo.severity === "high" ? "P1" : "P2",
          description,
          status: "investigating",
          commander: "Backend Simulation Agent",
          affectedServices: [service_name],
          investigationEvidence: evidence,
        });

        return {
          status: "completed",
          simulationId: simId,
          incidentId: simId,
          service: service_name,
          category: catInfo.label,
          evidencePackaged: [
            `Simulated runtime logs (${evidence.runtime_logs?.logs?.length || 0} entries)`,
            `Deployment event (${evidence.deployment_event?.deployment_id || "dep_1"})`,
            "Configuration change diff",
            "Knowledge base RAG indexes",
          ],
          evidence,
          incident,
        };
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Backend error: ${response.status}`);
      }
    } catch (error) {
      console.warn("Backend simulation endpoint error:", error);
      throw error;
    }
  },

  /**
   * Alias for backward compatibility
   */
  async runScenario(config = {}) {
    return this.generateSimulation(config);
  },
};
