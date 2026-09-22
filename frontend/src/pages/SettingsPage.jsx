import { useState } from "react";
import {
  Settings,
  Sparkles,
  GitBranch,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Tabs } from "../components/common/Tabs";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const [isSaved, setIsSaved] = useState(false);

  // Real settings state
  const [backendEndpoint, setBackendEndpoint] = useState("http://127.0.0.1:8000");
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [clusterRegion, setClusterRegion] = useState("us-east-1");
  const [retentionDays, setRetentionDays] = useState(30);

  const tabs = [
    { id: "ai", label: "AI & Investigation", icon: Sparkles },
    { id: "integrations", label: "Integrations", icon: GitBranch },
    { id: "system", label: "System", icon: Settings },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System configuration for TraceOps AI investigation engine and telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
          <Button
            size="sm"
            variant="primary"
            icon={Save}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1E293B] pb-1">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* TAB 1: AI & INVESTIGATION */}
      {activeTab === "ai" && (
        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-5 text-xs font-mono">
          <div className="border-b border-[#1E293B] pb-3">
            <h2 className="font-semibold text-slate-200">
              Backend Engine &amp; Safety Policy
            </h2>
            <p className="text-slate-400 font-sans mt-0.5">
              Configure backend connection and human-in-the-loop remediation safety bounds.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                TraceOps Backend API Base URL
              </label>
              <input
                type="text"
                value={backendEndpoint}
                onChange={(e) => setBackendEndpoint(e.target.value)}
                className="w-full sm:w-96 bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500 font-sans block mt-1">
                Connected to local FastAPI orchestrator instance exposing <code className="text-cyan-400">/investigate</code>
              </span>
            </div>

            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">
                  Autonomous Remediation Confidence Threshold
                </span>
                <span className="font-bold text-cyan-400">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <label className="text-slate-300 font-semibold block">
                Human Verification Guardrail
              </label>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#090D16] border border-[#1E293B] font-sans">
                <input
                  type="checkbox"
                  id="humanApp"
                  checked={requireHumanApproval}
                  onChange={(e) => setRequireHumanApproval(e.target.checked)}
                  className="mt-0.5 accent-cyan-500 rounded"
                />
                <label htmlFor="humanApp" className="cursor-pointer">
                  <span className="font-semibold text-slate-200 block">
                    Require Human Approval for Remediation
                  </span>
                  <span className="text-slate-400 text-xs">
                    Prevent automatic changes to production infrastructure without SRE authorization.
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E293B] pb-3 font-sans">
            <h2 className="font-semibold text-slate-200">
              Connected Telemetry &amp; Knowledge Sources
            </h2>
            <p className="text-slate-400 mt-0.5 text-xs">
              Active data providers monitored by TraceOps subagents.
            </p>
          </div>

          <div className="divide-y divide-[#1E293B]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Log Agent Data Source</span>
                <span className="text-slate-400 text-[11px] font-sans">data/logs/api.log &amp; application log streams</span>
              </div>
              <Badge variant="healthy" size="sm">Active</Badge>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Deployment Agent Data Source</span>
                <span className="text-slate-400 text-[11px] font-sans">data/deployments/deployments.json</span>
              </div>
              <Badge variant="healthy" size="sm">Active</Badge>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Knowledge Agent RAG Directory</span>
                <span className="text-slate-400 text-[11px] font-sans">data/knowledge/ (troubleshooting.md, previous_incidents.md)</span>
              </div>
              <Badge variant="healthy" size="sm">Active</Badge>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM */}
      {activeTab === "system" && (
        <div className="rounded-xl border border-[#1E293B] bg-[#0F1522] p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E293B] pb-3 font-sans">
            <h2 className="font-semibold text-slate-200">
              System Environment &amp; Retention
            </h2>
            <p className="text-slate-400 mt-0.5 text-xs">
              Global parameters for cluster environment and storage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Cluster Region
              </label>
              <select
                value={clusterRegion}
                onChange={(e) => setClusterRegion(e.target.value)}
                className="w-full bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg p-2.5 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="us-east-1">AWS us-east-1 (Production)</option>
                <option value="eu-west-1">AWS eu-west-1 (Staging)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Telemetry Retention
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full bg-[#090D16] border border-[#1E293B] text-slate-200 rounded-lg p-2.5 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value={14}>14 Days</option>
                <option value={30}>30 Days (Standard)</option>
                <option value={90}>90 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
