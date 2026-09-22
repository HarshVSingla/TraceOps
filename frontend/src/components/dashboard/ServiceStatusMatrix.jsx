import { Link } from "react-router-dom";
import { Server, ArrowUpRight } from "lucide-react";

import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { mockServices } from "../../data/mockServices";

export function ServiceStatusMatrix() {
  return (
    <Card
      title="Service Health &amp; Telemetry Matrix"
      subtitle="Real-time status across 7 critical infrastructure components"
      icon={Server}
      action={
        <Link
          to="/services"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>All Services</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      }
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[11px] uppercase">
              <th className="py-2.5 px-4 font-medium">Service</th>
              <th className="py-2.5 px-4 font-medium">Status</th>
              <th className="py-2.5 px-4 font-medium">p95 Latency</th>
              <th className="py-2.5 px-4 font-medium">Error Rate</th>
              <th className="py-2.5 px-4 font-medium">Throughput</th>
              <th className="py-2.5 px-4 font-medium">Version</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {mockServices.map((svc) => (
              <tr
                key={svc.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {svc.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {svc.tier}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={svc.status} size="sm" dot>
                    {svc.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={
                      svc.status === "degraded"
                        ? "text-amber-400 font-semibold"
                        : "text-slate-300"
                    }
                  >
                    {svc.p95Latency}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={
                      parseFloat(svc.errorRate) > 1
                        ? "text-rose-400 font-semibold"
                        : "text-slate-300"
                    }
                  >
                    {svc.errorRate}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{svc.throughput}</td>
                <td className="py-3 px-4 text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                    {svc.currentVersion}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-sans">
                  <Link
                    to={`/logs?service=${svc.id}`}
                    className="text-cyan-400 hover:underline text-xs"
                  >
                    View Logs
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
