import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { mockMetrics } from "../../data/mockMetrics";

export function SystemHealthBanner() {
  const navigate = useNavigate();
  const { systemHealth } = mockMetrics;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/60 p-5 backdrop-blur-xs relative overflow-hidden">
      {/* Subtle indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100">
                System Status: Degraded Performance Detected
              </h2>
              <Badge variant="p1" size="sm" dot>
                1 Critical Bottleneck
              </Badge>
              <Badge variant="healthy" size="sm">
                SLA: {systemHealth.sla}
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <span className="font-mono text-amber-300 font-medium">payment-api</span> is experiencing database connection timeouts after deployment v2.4.0. Upstream gateway reporting elevated 504 rates.
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link to="/incidents/INC-001">
            <Button
              size="sm"
              variant="outline"
              iconRight={ArrowRight}
              className="text-xs"
            >
              View INC-001 Details
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ai"
            icon={Sparkles}
            onClick={() => navigate("/investigate")}
            className="text-xs"
          >
            Run AI Root Cause Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
