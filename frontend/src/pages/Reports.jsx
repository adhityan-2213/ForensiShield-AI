import { useEffect, useState } from "react";
import { getInvestigations } from "../services/api";
import {jsPDF} from "jspdf";
import DashboardLayout from "../layouts/DashboardLayout";


export default function Reports() {
const [reports, setReports] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [selectedReport, setSelectedReport] = useState(null);
const [search, setSearch] = useState("");
const [riskFilter, setRiskFilter] = useState("ALL");


useEffect(() => {
loadReports();
}, []);

async function loadReports() {
try {
setLoading(true);
setError("");

  const data = await getInvestigations();
  setReports(data.investigations || []);
} catch (err) {
  setError(err.message || "Unable to load investigation reports.");
} finally {
  setLoading(false);
}

}

const filteredReports = reports.filter((report) => {
const searchText = search.toLowerCase();
const matchesSearch =
  (report.investigation_id || "").toLowerCase().includes(searchText) ||
  (report.title || "").toLowerCase().includes(searchText) ||
  (report.attack_classification || "").toLowerCase().includes(searchText);
const matchesRisk =
  riskFilter === "ALL" ||
  (report.risk_level || "UNKNOWN").toUpperCase() === riskFilter;

return matchesSearch && matchesRisk;

});

function formatDate(date) {
if (!date) return "N/A";

return new Date(date).toLocaleString();

}

function getRiskStyle(risk) {
switch ((risk || "UNKNOWN").toUpperCase()) {
case "HIGH":
return "bg-red-500/15 text-red-400 border-red-500/30";
case "MEDIUM":
return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
case "LOW":
return "bg-green-500/15 text-green-400 border-green-500/30";
default:
return "bg-gray-500/15 text-gray-400 border-gray-500/30";
}
}

function downloadReport(report) {
const doc = new jsPDF();

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 15;
const maxWidth = pageWidth - margin * 2;
let y = 20;

function addHeading(text) {
if (y > pageHeight - 25) {
doc.addPage();
y = 20;
}

doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text(text, margin, y);
y += 8;

}

function addText(label, value) {
const content =
value === undefined || value === null || value === ""
? "Not available"
: typeof value === "string"
? value
: JSON.stringify(value, null, 2);

doc.setFont("helvetica", "bold");
doc.setFontSize(10);

const labelLines = doc.splitTextToSize(label, maxWidth);

labelLines.forEach((line) => {
  if (y > pageHeight - 20) {
    doc.addPage();
    y = 20;
  }

  doc.text(line, margin, y);
  y += 5;
});

doc.setFont("helvetica", "normal");

const contentLines = doc.splitTextToSize(content, maxWidth);

contentLines.forEach((line) => {
  if (y > pageHeight - 15) {
    doc.addPage();
    y = 20;
  }

  doc.text(line, margin, y);
  y += 5;
});

y += 4;

}

function addSection(title, value) {
addHeading(title);
addText("", value);
}

doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.text("ForensiShield AI", margin, y);
y += 9;

doc.setFontSize(14);
doc.text("Digital Forensics Investigation Report", margin, y);
y += 12;

doc.setDrawColor(0, 180, 200);
doc.line(margin, y, pageWidth - margin, y);
y += 10;

addHeading("Investigation Details");

addText("Investigation ID:", report.investigation_id);
addText("Title:", report.title);
addText("Date & Time:", report.created_at
? new Date(report.created_at).toLocaleString()
: "Not available");
addText("Risk Level:", report.risk_level);
addText("Attack Classification:", report.attack_classification);
addSection("Investigation Summary", report.investigation_summary);
addSection("Uploaded Files", report.uploaded_files);
addSection("Suspicious Events", report.suspicious_events);
addSection("Repeated Failure Analysis", report.repeated_failure);
addSection("Evidence", report.evidence);
addSection("AI Explanation", report.explanation);
addSection("Recommended Actions", report.recommended_actions);
addSection("Analysis Limitations", report.limitations);

const totalPages = doc.internal.getNumberOfPages();

for (let page = 1; page <= totalPages; page++) {
doc.setPage(page);
doc.setFont("helvetica", "normal");
doc.setFontSize(8);

doc.text(
  `ForensiShield AI | Page ${page} of ${totalPages}`,
  pageWidth / 2,
  pageHeight - 8,
  { align: "center" }
);

}

const safeId = (report.investigation_id || "investigation").replace(/[^a-zA-Z0-9_-]/g, "_");

doc.save(`${safeId}_report.pdf`);
}

function renderList(items) {
if (!Array.isArray(items) || items.length === 0) {
return <p className="text-gray-400">No details available.</p>;
}

return (
  <ul className="list-disc space-y-2 pl-5 text-gray-300">
    {items.map((item, index) => (
      <li key={index}>
        {typeof item === "string" ? item : JSON.stringify(item)}
      </li>
    ))}
  </ul>
);

}

return (
    <DashboardLayout>
<div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
<div className="mx-auto max-w-7xl">
<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
<div>
<p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">ForensiShield AI</p>

        <h1 className="text-3xl font-bold sm:text-4xl">Investigation Reports</h1>
        <p className="mt-2 text-gray-400">Review and manage your saved log investigations.</p>
      </div>

      <button
        onClick={loadReports}
        disabled={loading}
        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-3 font-medium text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50">
        {loading ? "Loading..." : "Refresh Reports"}
      </button>
    </div>

    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">Total Reports</p>
        <p className="mt-2 text-3xl font-bold">{reports.length}</p>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">High Risk</p>
        <p className="mt-2 text-3xl font-bold text-red-400">
          {
            reports.filter(
              (report) =>
                (report.risk_level || "").toUpperCase() === "HIGH"
            ).length
          }
          </p>
      </div>

      <div className="rounded-xl border border-yellow-500/20 bg-slate-900 p-5">
        <p className="text-sm text-gray-400">Medium Risk</p>
        <p className="mt-2 text-3xl font-bold text-yellow-400">
          {
            reports.filter(
              (report) =>
                (report.risk_level || "").toUpperCase() === "MEDIUM"
            ).length
          }
        </p>
      </div>
    </div>

    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by ID, title, or attack..."
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"/>

      <select
        value={riskFilter}
        onChange={(event) => setRiskFilter(event.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500">
        <option value="ALL">All Risk Levels</option>
        <option value="HIGH">High Risk</option>
        <option value="MEDIUM">Medium Risk</option>
        <option value="LOW">Low Risk</option>
        <option value="UNKNOWN">Unknown Risk</option>
      </select>
    </div>

    {error && (
      <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
        <p>{error}</p>

        <button onClick={loadReports} className="mt-3 rounded-md bg-red-500/20 px-4 py-2 text-sm hover:bg-red-500/30">Try Again</button>
      </div>
    )}

    {loading ? (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center text-gray-400">
        Loading investigation reports...
      </div>
    ) : !error && filteredReports.length === 0 ? (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
        <h2 className="text-xl font-semibold">No Reports Found</h2>
        <p className="mt-2 text-gray-400">Upload and analyze a log file to generate an investigation report.</p>
      </div>
    ) : (
      !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-slate-700 bg-slate-800/70">
              <tr>
                <th className="px-5 py-4 text-sm text-gray-300">Investigation</th>
                <th className="px-5 py-4 text-sm text-gray-300">Date</th>
                <th className="px-5 py-4 text-sm text-gray-300">Classification</th>
                <th className="px-5 py-4 text-sm text-gray-300">Risk Level</th>
                <th className="px-5 py-4 text-sm text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.investigation_id}
                  className="border-b border-slate-800 transition hover:bg-slate-800/50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {report.title || "Log Investigation"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {report.investigation_id}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {formatDate(report.created_at)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-300">
                    {report.attack_classification || "Not classified"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskStyle(
                        report.risk_level
                      )}`}
                    >
                      {(report.risk_level || "UNKNOWN").toUpperCase()}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="rounded-md bg-cyan-500/15 px-3 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25"
                      >
                        View
                      </button>

                      <button
                        onClick={() => downloadReport(report)}
                        className="rounded-md bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
                      >
                        Download PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    )}

    {selectedReport && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 sm:p-8">
        <div className="mx-auto my-6 max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Investigation Report</p>
              <h2 className="mt-2 text-2xl font-bold">{selectedReport.title || "Log Investigation"}</h2>
              <p className="mt-2 text-sm text-gray-400">{selectedReport.investigation_id}</p>
            </div>

            <button onClick={() => setSelectedReport(null)}className="self-start rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700">Close</button>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-800 p-4">
              <p className="text-sm text-gray-400">Risk Level</p>
              <p className="mt-2 text-lg font-bold">{(selectedReport.risk_level || "UNKNOWN").toUpperCase()}</p>
            </div>

            <div className="rounded-lg bg-slate-800 p-4">
              <p className="text-sm text-gray-400">Date & Time</p>
              <p className="mt-2 font-medium">{formatDate(selectedReport.created_at)}</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Investigation Summary</h3>
              <p className="whitespace-pre-wrap leading-7 text-gray-300">{selectedReport.investigation_summary || "No summary available."}</p>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Attack Classification</h3>
              <p className="text-gray-300">{selectedReport.attack_classification || "Not classified"}</p>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Uploaded Files</h3>
              {renderList(
                (selectedReport.uploaded_files || []).map((file) =>
                  typeof file === "string"
                    ? file
                    : file.name || JSON.stringify(file)
                )
              )}
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Suspicious Events</h3>
              {renderList(selectedReport.suspicious_events)}
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Repeated Failure Analysis</h3>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-800 p-4 text-sm text-gray-300">
                {JSON.stringify(selectedReport.repeated_failure || {}, null, 2)}
              </pre>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Evidence</h3>
              {renderList(selectedReport.evidence)}
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">AI Explanation</h3>
              <p className="whitespace-pre-wrap leading-7 text-gray-300">{selectedReport.explanation || "No explanation available."}</p>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Recommended Actions</h3>
              {renderList(selectedReport.recommended_actions)}
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">Limitations</h3>
              {renderList(selectedReport.limitations)}
            </section>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => downloadReport(selectedReport)}
              className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Export Report as JSON
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
</DashboardLayout>
);
}