import { Badge } from "../common/Badge";


export function ServiceTopology({ services = [] }) {
  const tiers = [
    {
      title: "Ingress & Edge",
      nodes: ["api-gateway"],
    },
    {
      title: "Application Core",
      nodes: ["payment-api", "auth-service"],
    },
    {
      title: "Background Processing",
      nodes: ["order-worker", "notification-service"],
    },
    {
      title: "Persistence & Cache",
      nodes: ["postgres-cluster", "redis-cache"],
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between text-xs">
        <div>
          <h3 className="font-semibold text-slate-100 font-sans">
            Architecture Dependency Map
          </h3>
          <p className="text-slate-400 mt-0.5">
            Service-to-service call graphs and active degradation flow
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Healthy
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Degraded
          </span>
        </div>
      </div>

      {/* Tiers Column Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {tiers.map((tier, tIdx) => (
          <div
            key={tier.title}
            className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2.5 flex flex-col justify-start"
          >
            <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold border-b border-slate-800 pb-1.5 flex items-center justify-between">
              <span>{tier.title}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Tier {tIdx + 1}
              </span>
            </div>

            <div className="space-y-2">
              {tier.nodes.map((nodeId) => {
                const svc = services.find((s) => s.id === nodeId);
                if (!svc) return null;

                const isDegraded = svc.status === "degraded";

                return (
                  <div
                    key={svc.id}
                    className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                      isDegraded
                        ? "border-amber-500/40 bg-amber-950/20 shadow-xs shadow-amber-950"
                        : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-semibold text-slate-200 truncate">
                        {svc.name}
                      </span>
                      <Badge variant={svc.status} size="sm" dot>
                        {svc.status}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      p95:{" "}
                      <span
                        className={isDegraded ? "text-amber-400 font-bold" : "text-slate-300"}
                      >
                        {svc.p95Latency}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 truncate mt-1">
                      {svc.runtime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
