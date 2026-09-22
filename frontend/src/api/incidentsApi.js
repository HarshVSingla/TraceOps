import { mockIncidents } from "../data/mockIncidents";

// In-memory store initialized with mock data
let incidentsStore = [...mockIncidents];

export const incidentsApi = {
  /**
   * Get all incidents (or filtered by status/severity/service/query)
   */
  async getIncidents(filters = {}) {
    let result = [...incidentsStore];

    if (filters.status && filters.status !== "all") {
      result = result.filter((i) => i.status === filters.status);
    }
    if (filters.severity && filters.severity !== "all") {
      result = result.filter(
        (i) =>
          i.severity === filters.severity ||
          i.severityRank?.toLowerCase() === filters.severity.toLowerCase()
      );
    }
    if (filters.service && filters.service !== "all") {
      result = result.filter((i) => i.service === filters.service);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.service.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }

    return result;
  },

  /**
   * Get a single incident by ID
   */
  async getIncidentById(id) {
    if (!id) return null;
    const found = incidentsStore.find(
      (i) => i.id.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  },

  /**
   * Add a new incident (e.g. created manually or by simulator)
   */
  async createIncident(incidentData) {
    const newIncident = {
      id: incidentData.id || `INC-${Math.floor(100 + Math.random() * 900)}`,
      isSimulated: incidentData.isSimulated ?? true,
      title: incidentData.title || "Simulated Service Anomaly",
      service: incidentData.service || "payment-api",
      severity: incidentData.severity || "high",
      severityRank: incidentData.severityRank || (incidentData.severity === "critical" ? "P0" : "P1"),
      description: incidentData.description || "Generated simulation incident for testing.",
      timestamp: incidentData.timestamp || new Date().toISOString(),
      detectedTime: incidentData.detectedTime || "Just now",
      status: incidentData.status || "investigating",
      commander: incidentData.commander || "TraceOps Autonomous Agent",
      affectedServices: incidentData.affectedServices || [incidentData.service || "payment-api"],
      rootCauseSummary: incidentData.rootCauseSummary || "Pending AI investigation analysis.",
      confidence: incidentData.confidence || 90,
      mttd: incidentData.mttd || "2m 15s",
      leadAgent: incidentData.leadAgent || "Root Cause Agent",
      agentStatus: incidentData.agentStatus || "Ready for Investigation",
      timeline: incidentData.timeline || [
        {
          id: `t-${Date.now()}-1`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "deployment",
          title: "Simulation deployment event generated",
          description: `Config change pushed to ${incidentData.service || "payment-api"}`,
          author: "Simulation Agent",
        },
        {
          id: `t-${Date.now()}-2`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "alert",
          title: "Controlled failure detected",
          description: "Latency anomaly triggered alert threshold",
          author: "Prometheus",
        },
      ],
      ...incidentData,
    };

    incidentsStore = [newIncident, ...incidentsStore];
    return newIncident;
  },

  /**
   * Update incident status (e.g. mitigated, resolved)
   */
  async updateIncidentStatus(id, newStatus) {
    incidentsStore = incidentsStore.map((inc) =>
      inc.id.toLowerCase() === id.toLowerCase()
        ? { ...inc, status: newStatus }
        : inc
    );
    return this.getIncidentById(id);
  },
};
