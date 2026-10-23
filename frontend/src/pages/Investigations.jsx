import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getInvestigations } from "../services/api";

function Investigations() {
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);

  useEffect(() => {
    async function loadInvestigations() {
      try {
        setLoading(true);
        setError("");

        const data = await getInvestigations();
        setInvestigations(data.investigations || []);
      } catch (err) {
        setError(err.message || "Unable to load investigations.");
      } finally {
        setLoading(false);
      }
    }

    loadInvestigations();
  }, []);

  const riskColor = (risk) => {
    switch ((risk || "UNKNOWN").toUpperCase()) {
      case "HIGH":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      case "MEDIUM":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "LOW":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Investigation History</h1>
          <p className="mt-2 text-slate-400">View previously saved log investigations and AI reports.</p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-300">
            Loading investigations...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && investigations.length === 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
            <h2 className="text-lg font-semibold text-white">No investigations yet</h2>
            <p className="mt-2 text-slate-400">Upload a log file in Log Analysis to create your first investigation.</p>
          </div>
        )}

        {!loading && investigations.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-700 bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-5 py-4">Investigation ID</th>
                  <th className="px-5 py-4">File / Title</th>
                  <th className="px-5 py-4">Attack Classification</th>
                  <th className="px-5 py-4">Risk Level</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {investigations.map((item) => (
                  <tr
                    key={item.investigation_id}
                    className="text-slate-300 hover:bg-slate-800/60"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-cyan-300">
                      {item.investigation_id}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-white">{item.title}</span>
                    </td>

                    <td className="px-5 py-4">
                      {item.attack_classification || "Undetermined"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${riskColor(
                          item.risk_level
                        )}`}
                      >
                        {item.risk_level || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "Unavailable"}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedInvestigation(item)}
                        className="rounded-lg bg-cyan-500/15 px-3 py-2 font-medium text-cyan-300 transition hover:bg-cyan-500/25"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedInvestigation && (
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedInvestigation.title}</h2>
                <p className="mt-1 font-mono text-xs text-cyan-300">{selectedInvestigation.investigation_id}</p>
              </div>

              <button
                onClick={() => setSelectedInvestigation(null)}
                className="rounded-lg border border-slate-600 px-3 py-2 text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-5 text-sm text-slate-300">
              <div>
                <h3 className="mb-2 font-semibold text-white">Investigation Summary</h3>
                <p>{selectedInvestigation.investigation_summary ||"No summary available."}</p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-white">Attack Classification</h3>
                <p>{selectedInvestigation.attack_classification ||"Undetermined"}</p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-white">AI Explanation</h3>
                <p>{selectedInvestigation.explanation ||"No explanation available."}</p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-white">Evidence Observed</h3>

                {Array.isArray(selectedInvestigation.evidence) &&
                selectedInvestigation.evidence.length > 0 ? (
                  <ul className="list-inside list-disc space-y-2">
                    {selectedInvestigation.evidence.map((evidence, index) => (
                      <li key={index}>
                        {typeof evidence === "string"
                          ? evidence
                          : JSON.stringify(evidence)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No evidence details available.</p>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-white">Recommended Actions</h3>

                {Array.isArray(selectedInvestigation.recommended_actions) &&
                selectedInvestigation.recommended_actions.length > 0 ? (
                  <ul className="list-inside list-disc space-y-2">
                    {selectedInvestigation.recommended_actions.map(
                      (action, index) => (
                        <li key={index}>
                          {typeof action === "string"
                            ? action
                            : JSON.stringify(action)}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No recommendations available.</p>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-white">Limitations</h3>

                {Array.isArray(selectedInvestigation.limitations) &&
                selectedInvestigation.limitations.length > 0 ? (
                  <ul className="list-inside list-disc space-y-2">
                    {selectedInvestigation.limitations.map((limitation, index) => (
                      <li key={index}>
                        {typeof limitation === "string"
                          ? limitation
                          : JSON.stringify(limitation)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No limitations recorded.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default Investigations;