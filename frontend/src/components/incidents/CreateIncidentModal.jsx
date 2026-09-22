import { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { mockServices } from "../../data/mockServices";
import { Sparkles } from "lucide-react";


export function CreateIncidentModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [service, setService] = useState(mockServices[0].id);
  const [severity, setSeverity] = useState("high");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const newIncident = {
      id: `INC-00${Math.floor(Math.random() * 900) + 100}`,
      title,
      service,
      severity,
      severityRank: severity === "critical" ? "P0" : severity === "high" ? "P1" : "P2",
      description,
      timestamp: new Date().toISOString(),
      detectedTime: "Just now",
      status: "investigating",
      commander: "Alex Rivera (Lead SRE)",
      affectedServices: [service],
      rootCauseSummary: "AI Orchestrator dispatched. Ingesting telemetry...",
      confidence: 78,
      leadAgent: "Orchestrator",
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          type: "alert",
          title: "Manual Incident Declared",
          description: description || "User initiated incident investigation",
          author: "SRE Commander",
        },
      ],
    };

    onCreate?.(newIncident);
    onClose();
    setTitle("");
    setDescription("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Declare New Incident Drill"
      subtitle="Manually trigger an incident to simulate multi-agent analysis and alert routing"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={handleSubmit}
          >
            Declare &amp; Dispatch AI
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1.5">
            Incident Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Connection pool saturation on payment-api"
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Impacted Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {mockServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.tier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="critical">P0 - Critical Outage</option>
              <option value="high">P1 - High Latency / Degraded</option>
              <option value="medium">P2 - Medium Warning</option>
              <option value="low">P3 - Low Impact</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">
            Incident Description &amp; Symptoms
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe observed errors, alerts, customer impact, or suspect deployments..."
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </form>
    </Modal>
  );
}
