import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { incidentsApi } from "../api/incidentsApi";
import { mockServices } from "../data/mockServices";

export function DashboardPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await incidentsApi.getIncidents();
      setIncidents(data);
    }
    loadData();
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const criticalIncidents = activeIncidents.filter(
    (i) => i.severity === "critical" || i.severityRank === "P0"
  );
  const monitoredServicesCount = mockServices.length;

  const activityStream = [
    { time: "09:48", type: "ai", text: "Root cause identified for INC-001 (Confidence: 96%)" },
    { time: "09:46", type: "ai", text: "TraceOps Orchestrator dispatched subagents" },
    { time: "09:44", type: "error", text: "Error rate spike detected on payment-api (+4.8%)" },
    { time: "09:42", type: "deployment", text: "Deployment v2.4.0 completed on payment-api" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              Operations Overview
            </h1>
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              SYSTEM OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident state across active microservices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={FlaskConical}
            onClick={() => navigate("/simulator")}
          >
            Simulation Lab
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={ArrowRight}
            onClick={() => navigate("/incidents")}
          >
            All Incidents
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#0F1522]">
          <span className="text-xs text-slate-400 uppercase block">Active Incidents</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-100">
              {activeIncidents.length}
            </span>
            <span className="text-xs text-slate-400">requiring attention</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#0F1522]">
          <span className="text-xs text-rose-400 uppercase block font-semibold">
            Critical Outages (P0)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-300">
              {criticalIncidents.length}
            </span>
            <span className="text-xs text-slate-400">unresolved</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#0F1522]">
          <span className="text-xs text-slate-400 uppercase block">Monitored Services</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-100">
              {monitoredServicesCount}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">100% telemetry</span>
          </div>
        </div>
      </div>

      {/* ACTIVE INCIDENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase text-slate-300 tracking-wider">
            Active Incidents
          </h2>
          <Link
            to="/incidents"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View all ({incidents.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] overflow-hidden">
          <div className="divide-y divide-[#1E293B]">
            {activeIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="p-4 hover:bg-[#161f30] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={inc.severity} size="sm" dot>
                      {inc.severityRank || "P1"}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {inc.id}
                    </span>
                    {inc.isSimulated && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        SIMULATED
                      </span>
                    )}
                    <Badge variant={inc.status} size="sm">
                      {inc.status}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {inc.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Service: <span className="text-slate-200">{inc.service}</span> • Detected: {inc.detectedTime}
                  </div>
                </div>

                <div className="shrink-0">
                  <Button size="sm" variant="outline" iconRight={ArrowRight}>
                    Investigate
                  </Button>
                </div>
              </div>
            ))}

            {activeIncidents.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                No active incidents right now. All systems operational.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY STREAM */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-mono font-semibold uppercase text-slate-300 tracking-wider">
          Recent Activity Stream
        </h2>

        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-4 font-mono text-xs space-y-2.5">
          {activityStream.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors"
            >
              <span className="text-slate-400 text-[11px] shrink-0">{item.time}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.type === "ai"
                    ? "bg-purple-400"
                    : item.type === "error"
                    ? "bg-rose-400"
                    : "bg-amber-400"
                }`}
              />
              <span className="truncate">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
