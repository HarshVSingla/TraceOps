import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { IncidentDetailPage } from "./pages/IncidentDetailPage";
import { SimulationLabPage } from "./pages/SimulationLabPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authenticated Console Routes wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          {/* 2. Operations Overview */}
          <Route path="/overview" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/overview" replace />} />

          {/* 3. Incidents List */}
          <Route path="/incidents" element={<IncidentsPage />} />

          {/* 4. Unified Incident Investigation Workspace */}
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />

          {/* 5. Simulation Lab */}
          <Route path="/simulator" element={<SimulationLabPage />} />

          {/* 6. Settings */}
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}