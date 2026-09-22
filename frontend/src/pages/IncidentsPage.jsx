import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { SearchBar } from "../components/common/SearchBar";
import { incidentsApi } from "../api/incidentsApi";
import { mockServices } from "../data/mockServices";

export function IncidentsPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedService, setSelectedService] = useState("all");

  useEffect(() => {
    async function loadIncidents() {
      setLoading(true);
      const data = await incidentsApi.getIncidents({
        query: searchQuery,
        severity: selectedSeverity,
        status: selectedStatus,
        service: selectedService,
      });
      setIncidents(data);
      setLoading(false);
    }
    loadIncidents();
  }, [searchQuery, selectedSeverity, selectedStatus, selectedService]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
              Incidents
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50">
              {incidents.length} TOTAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active and historical production incidents and simulated testing drills.
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
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-xl border border-[#1E293B] bg-[#0F1522]">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search incident ID, title, or service..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Severity filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Severity: All</option>
            <option value="critical">P0 (Critical)</option>
            <option value="high">P1 (High)</option>
            <option value="medium">P2 (Medium)</option>
            <option value="low">P3 (Low)</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="investigating">Investigating</option>
            <option value="active">Active</option>
            <option value="mitigated">Mitigated</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Service filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Service: All</option>
            {mockServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {(selectedSeverity !== "all" ||
            selectedStatus !== "all" ||
            selectedService !== "all" ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedSeverity("all");
                setSelectedStatus("all");
                setSelectedService("all");
                setSearchQuery("");
              }}
              className="text-cyan-400 hover:underline px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Incident List Table */}
      <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#090D16] text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4 font-medium">Incident ID</th>
                <th className="py-3 px-4 font-medium">Severity</th>
                <th className="py-3 px-4 font-medium">Title &amp; Summary</th>
                <th className="py-3 px-4 font-medium">Affected Service</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Detected</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-mono">
              {incidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="hover:bg-[#161f30] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-cyan-400 whitespace-nowrap">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={inc.severity} size="sm" dot>
                      {inc.severityRank || "P1"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 max-w-md font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {inc.title}
                      </span>
                      {inc.isSimulated && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                          SIMULATED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {inc.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-[#090D16] border border-[#1E293B] text-slate-300">
                      {inc.service}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={inc.status} size="sm">
                      {inc.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {inc.detectedTime}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-sans">
                    <Button
                      size="sm"
                      variant="outline"
                      iconRight={ArrowRight}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/incidents/${inc.id}`);
                      }}
                    >
                      Investigate
                    </Button>
                  </td>
                </tr>
              ))}

              {!loading && incidents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No incidents match your current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
