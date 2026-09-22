import { MetricCard } from "../common/MetricCard";
import { mockMetrics } from "../../data/mockMetrics";
import { AlertCircle, Clock, Zap, Cpu } from "lucide-react";

export function MetricSparklines() {
  const icons = [AlertCircle, Clock, Zap, Cpu];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockMetrics.kpis.map((kpi, idx) => (
        <MetricCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          subValue={kpi.subValue}
          change={kpi.change}
          changeType={kpi.changeType}
          status={kpi.status}
          sparkline={kpi.sparkline}
          icon={icons[idx]}
        />
      ))}
    </div>
  );
}
