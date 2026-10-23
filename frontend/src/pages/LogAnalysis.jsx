import UploadZone from "../components/UploadZone";
import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";

function LogAnalysis() {
    function handleAnalysisComplete(results) {
  const files = Array.isArray(results?.analysis_results)
    ? results.analysis_results
    : [];

  const suspiciousEvents = files.reduce((total, file) => {
    return (
      total +
      (Array.isArray(file.suspicious_events)
        ? file.suspicious_events.length
        : 0)
    );
  }, 0);

  const previousStats = JSON.parse(
    localStorage.getItem("dashboardStats") ||
      '{"totalInvestigations":0,"filesAnalysed":0,"suspiciousEvents":0}'
  );

  const updatedStats = {
    totalInvestigations: previousStats.totalInvestigations + 1,
    filesAnalysed: previousStats.filesAnalysed + files.length,
    suspiciousEvents:
      previousStats.suspiciousEvents + suspiciousEvents,
  };

  localStorage.setItem(
    "dashboardStats",
    JSON.stringify(updatedStats)
  );
}
  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Security Log Analysis</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Upload security logs to detect suspicious activities,investigate repeated login failures, and generate AI-assisted forensic reports.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-cyan-400">Rule-Based Detection</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Identifies log patterns associated with failed login attempts and repeated failures.</p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-purple-400">AI Investigation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Generates an evidence-based summary, possible attack classification, and risk assessment.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold text-emerald-400">Recommended Actions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Provides practical investigation steps based on the supplied log evidence.</p>
          </div>
        </div>
        <UploadZone onAnalysisComplete={handleAnalysisComplete}/>
      </section>
    </DashboardLayout>
  );
}

export default LogAnalysis;