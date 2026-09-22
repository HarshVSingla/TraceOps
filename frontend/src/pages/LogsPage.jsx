import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Sparkles,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { SearchBar } from "../components/common/SearchBar";
import { LogHistogram } from "../components/logs/LogHistogram";
import { LogDetailDrawer } from "../components/logs/LogDetailDrawer";
import { mockLogs } from "../data/mockLogs";
import { mockServices } from "../data/mockServices";

export function LogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedService = searchParams.get("service") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState(["ERROR", "WARN", "INFO"]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const handleLevelToggle = (level) => {
    if (selectedLevels.includes(level)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter((l) => l !== level));
      }
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const filteredLogs = mockLogs.filter((log) => {
    const matchesService =
      selectedService === "all" || log.service === selectedService;
    const matchesLevel = selectedLevels.includes(log.level);
    const matchesQuery =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.endpoint && log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesService && matchesLevel && matchesQuery;
  });

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
              Logs &amp; Telemetry Explorer
            </h1>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50 flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveStreaming ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              />
              {isLiveStreaming ? "LIVE INGESTION" : "PAUSED"}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Explore high-throughput distributed application traces, errors, and system logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={isLiveStreaming ? Pause : Play}
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          >
            {isLiveStreaming ? "Pause Stream" : "Resume Stream"}
          </Button>
          <Button
            size="sm"
            variant="ai"
            icon={Sparkles}
            onClick={() =>
              navigate("/investigate", {
                state: {
                  service: selectedService !== "all" ? selectedService : "payment-api",
                  description: "Analyze recent error spike from logs explorer",
                },
              })
            }
          >
            Investigate with AI
          </Button>
        </div>
      </div>

      {/* Histogram Chart */}
      <LogHistogram />

      {/* Filter and Query Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Query logs (e.g. timeout, connection pool, status:500)..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Service selector */}
            <select
              value={selectedService}
              onChange={(e) => {
                setSearchParams({ service: e.target.value });
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">All Microservices</option>
              {mockServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Quick Syntax helpers */}
            <button
              type="button"
              onClick={() => setSearchQuery("timeout")}
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
            >
              +timeout
            </button>
            <button
              type="button"
              onClick={() => setSearchQuery("504")}
              className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
            >
              +504
            </button>
          </div>
        </div>

        {/* Log Level Toggles */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
          <span className="text-slate-400 text-[11px] uppercase mr-1">
            Level Filter:
          </span>
          {["ERROR", "WARN", "INFO"].map((lvl) => {
            const isSelected = selectedLevels.includes(lvl);
            const colorClass =
              lvl === "ERROR"
                ? isSelected
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-slate-950 text-slate-500 border-slate-800"
                : lvl === "WARN"
                ? isSelected
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-950 text-slate-500 border-slate-800"
                : isSelected
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-slate-950 text-slate-500 border-slate-800";

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleLevelToggle(lvl)}
                className={`px-2.5 py-1 rounded border text-xs font-semibold transition-colors cursor-pointer ${colorClass}`}
              >
                {lvl}
              </button>
            );
          })}
          <span className="text-[11px] text-slate-400 ml-auto">
            Showing {filteredLogs.length} events
          </span>
        </div>
      </div>

      {/* Terminal Log Stream Table */}
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] uppercase">
                <th className="py-2.5 px-4 font-medium w-44">Timestamp</th>
                <th className="py-2.5 px-4 font-medium w-20">Level</th>
                <th className="py-2.5 px-4 font-medium w-36">Service</th>
                <th className="py-2.5 px-4 font-medium">Message &amp; Exception Summary</th>
                <th className="py-2.5 px-4 font-medium w-24 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-[#070b12]">
              {filteredLogs.map((log) => {
                const isErr = log.level === "ERROR";
                const isWrn = log.level === "WARN";

                return (
                  <tr
                    key={log.id}
                    onClick={() => handleLogClick(log)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group select-text"
                  >
                    <td className="py-2 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isErr
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : isWrn
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-cyan-400/90 whitespace-nowrap font-medium">
                      {log.service}
                    </td>
                    <td className="py-2 px-4">
                      <div
                        className={`truncate max-w-2xl ${
                          isErr
                            ? "text-rose-200 font-medium group-hover:text-rose-100"
                            : isWrn
                            ? "text-amber-200 group-hover:text-amber-100"
                            : "text-slate-300 group-hover:text-slate-100"
                        }`}
                        title={log.message}
                      >
                        {log.message}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right text-slate-400 text-[11px] whitespace-nowrap">
                      {log.durationMs ? `${log.durationMs}ms` : "-"}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No log events match the query filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-over Log Detail Drawer */}
      <LogDetailDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
