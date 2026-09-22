import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ScrollText,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { SearchBar } from "../components/common/SearchBar";
import { ServiceTopology } from "../components/services/ServiceTopology";
import { mockServices } from "../data/mockServices";

export function ServicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredServices = mockServices.filter((svc) => {
    const matchesSearch =
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.runtime.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.tier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || svc.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
              Microservices &amp; Infrastructure Catalog
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
              {mockServices.length} MONITORED
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Service topology, SLA health metrics, latency baselines, and deployment versions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="ai"
            icon={Sparkles}
            onClick={() => navigate("/investigate")}
          >
            Investigate Service Anomaly
          </Button>
        </div>
      </div>

      {/* Architecture Topology View */}
      <ServiceTopology services={mockServices} />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search service name, runtime, or tier..."
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="healthy">Healthy Only</option>
            <option value="degraded">Degraded Only</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((svc) => {
          const isDegraded = svc.status === "degraded";

          return (
            <Card
              key={svc.id}
              className={`flex flex-col justify-between ${
                isDegraded ? "border-amber-500/40 bg-amber-950/10" : ""
              }`}
              bodyClassName="p-5 flex-1 flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                      <span>{svc.name}</span>
                    </h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {svc.tier} • {svc.runtime}
                    </span>
                  </div>
                  <Badge variant={svc.status} size="sm" dot>
                    {svc.status}
                  </Badge>
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase">
                      p95 Latency
                    </span>
                    <span
                      className={`font-bold mt-0.5 block ${
                        isDegraded ? "text-amber-400" : "text-slate-200"
                      }`}
                    >
                      {svc.p95Latency}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Error Rate
                    </span>
                    <span
                      className={`font-bold mt-0.5 block ${
                        parseFloat(svc.errorRate) > 1
                          ? "text-rose-400"
                          : "text-slate-200"
                      }`}
                    >
                      {svc.errorRate}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Throughput
                    </span>
                    <span className="font-semibold text-slate-200 mt-0.5 block">
                      {svc.throughput}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Uptime (30d)
                    </span>
                    <span className="font-semibold text-emerald-400 mt-0.5 block">
                      {svc.uptime}
                    </span>
                  </div>
                </div>

                {/* Deployment & Version Info */}
                <div className="mt-3 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Version:</span>
                    <span className="text-slate-200 font-semibold px-1.5 py-0.5 rounded bg-slate-800">
                      {svc.currentVersion}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Deployed:</span>
                    <span className="text-slate-300">{svc.lastDeployment}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Lead Owner:</span>
                    <span className="text-slate-300 truncate max-w-[150px]">
                      {svc.leadOwner}
                    </span>
                  </div>
                </div>

                {/* Dependencies badges */}
                {svc.dependencies && svc.dependencies.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Upstream Calls:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {svc.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  to={`/logs?service=${svc.id}`}
                  className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>Logs</span>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  icon={Sparkles}
                  onClick={() =>
                    navigate("/investigate", {
                      state: {
                        service: svc.id,
                        description: `Routine AI telemetry check for ${svc.name}`,
                      },
                    })
                  }
                  className="text-xs"
                >
                  Analyze
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
