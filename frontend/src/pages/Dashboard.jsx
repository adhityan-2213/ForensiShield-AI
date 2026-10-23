import { useEffect, useState } from "react";
import { checkBackendHealth } from "../services/api";
import MetricCard from "../components/MetricCard";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [dashboardStats, setDashboardStats] = useState({
    totalInvestigations: 0,
    filesAnalysed: 0,
    suspiciousEvents: 0,
  });

  useEffect(() => {
    function loadDashboardStats() {
      try {
        const savedStats = localStorage.getItem("dashboardStats");

        if (savedStats) {
          const parsedStats = JSON.parse(savedStats);

          setDashboardStats({
            totalInvestigations: parsedStats.totalInvestigations ?? 0,
            filesAnalysed: parsedStats.filesAnalysed ?? 0,
            suspiciousEvents: parsedStats.suspiciousEvents ?? 0,
          });
        }
      } catch (error) {
        console.error(
          "Unable to load dashboard statistics:",
          error
        );
      }
    }

    loadDashboardStats();

    window.addEventListener("focus", loadDashboardStats);

    return () => {
      window.removeEventListener("focus", loadDashboardStats);
    };
  }, []);

  useEffect(() => {
    async function checkConnection() {
      try {
        const data = await checkBackendHealth();

        setBackendStatus(
          data.success ? "Connected" : "Unhealthy"
        );
      } catch {
        setBackendStatus("Disconnected");
      }
    }

    checkConnection();
  }, []);

  return (
    <DashboardLayout>
      <section id="dashboard">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Investigation Dashboard</h2>
          <p className="mt-2 text-slate-300">Monitor security investigations and analyze suspicious activity.</p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard title="Total Investigations" value={dashboardStats.totalInvestigations} description="Based on recorded investigations"/>
          <MetricCard title="Files Analysed" value={dashboardStats.filesAnalysed} description="Files analysed in this session"/>
          <MetricCard title="Suspicious Events" value={dashboardStats.suspiciousEvents} description="Events detected in this session"/>
        </div>

        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <p className="text-sm text-slate-300">
            Backend Status:{" "}
            <span
              className={
                backendStatus === "Connected"
                  ? "font-semibold text-emerald-400"
                  : backendStatus === "Checking..."
                    ? "font-semibold text-cyan-400"
                    : "font-semibold text-amber-400"
              }
            >
              {backendStatus}
            </span>
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;