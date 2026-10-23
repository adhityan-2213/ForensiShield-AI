import { useRef, useState } from "react";
import { uploadLogFiles } from "../services/api";

function UploadZone({ onAnalysisComplete }) {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [analysisStatus, setAnalysisStatus] = useState("idle");
  const [analysisResults, setAnalysisResults] = useState(null);
  const allowedExtensions = [".log", ".txt", ".csv"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  function validateFiles(fileList) {
    const files = Array.from(fileList);

    if (files.length === 0) {
      return;
    }

    const invalidFiles = files.filter((file) => {
      const fileName = file.name.toLowerCase();

      const hasAllowedExtension = allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

      const hasValidSize =
        file.size > 0 && file.size <= MAX_FILE_SIZE;

      return !hasAllowedExtension || !hasValidSize;
    });

    if (invalidFiles.length > 0) {
      setError(
        "Invalid file detected. Select non-empty .log, .txt, or .csv files up to 10 MiB each."
      );
      return;
    }

    const uniqueFiles = Array.from(
      new Map(
        files.map((file) => [
          `${file.name}-${file.size}-${file.lastModified}`,
          file,
        ])
      ).values()
    );

    setSelectedFiles(uniqueFiles);
    setError("");
    setAnalysisResults(null);
    setAnalysisStatus("ready");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event) {
    validateFiles(event.target.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    validateFiles(event.dataTransfer.files);
  }

  function handleRemoveFile(indexToRemove) {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );

    setSelectedFiles(updatedFiles);
    setAnalysisResults(null);
    setAnalysisStatus(updatedFiles.length > 0 ? "ready" : "idle");
    setError("");
  }

  async function handleAnalyze() {
    if (selectedFiles.length === 0) {
      setError("Please select at least one valid log file.");
      return;
    }

    setError("");
    setAnalysisResults(null);
    setAnalysisStatus("processing");

    try {
      const result = await uploadLogFiles(selectedFiles);

      console.log("Backend response:", result);

      if (!result || result.success !== true) {
        throw new Error(
          result?.message || "The backend could not analyze the files."
        );
      }

      setAnalysisResults(result);
      setAnalysisStatus("completed");

      if (typeof onAnalysisComplete === "function") {
        onAnalysisComplete(result);
      }
    } catch (uploadError) {
      console.error("Upload error:", uploadError);

      setAnalysisStatus("error");
      setError(
        uploadError.message || "Unable to upload and analyze files."
      );
    }
  }

  function formatEventType(value) {
    return String(value || "Security Event").replaceAll("_", " ");
  }

  function getSeverityClass(severity) {
    switch (String(severity || "").toUpperCase()) {
      case "HIGH":
        return "bg-red-500/20 text-red-400";

      case "MEDIUM":
        return "bg-amber-500/20 text-amber-300";

      case "LOW":
        return "bg-emerald-500/20 text-emerald-400";

      default:
        return "bg-slate-700 text-slate-200";
    }
  }

  const analysisFiles = Array.isArray(analysisResults?.analysis_results)
    ? analysisResults.analysis_results
    : [];

  return (
    <div className="w-full">

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Select or drop investigation log files"
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition duration-200 ${
          isDragging
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-600 bg-slate-900/60 hover:border-cyan-400 hover:bg-slate-900"
        }`}
      >
        <div className="text-5xl">📂</div>
        <h3 className="mt-4 text-xl font-semibold text-white">Upload Investigation Logs</h3>
        <p className="mt-3 text-sm text-slate-300">Drag and drop your log files here</p>
        <p className="mt-2 text-xs text-slate-500">Or click to browse · LOG, TXT, CSV</p>
        <p className="mt-2 text-xs text-slate-500">Maximum file size: 10 MB per file</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".log,.txt,.csv"
          multiple
          onChange={handleFileChange}
          onClick={(event) => event.stopPropagation()}
          className="hidden"
        />
      </div>

      {error && (
        <div
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-semibold text-white">
              Selected Files ({selectedFiles.length})
            </h4>

            <span className="text-xs text-slate-400">
              Total:{" "}
              {(
                selectedFiles.reduce(
                  (total, file) => total + file.size,
                  0
                ) /
                (1024 * 1024)
              ).toFixed(2)}{" "}
              MiB
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div className="min-w-0">
                  <p className="break-all text-sm font-medium text-slate-200">📄 {file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  disabled={analysisStatus === "processing"}
                  className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            {analysisStatus === "ready" && (
              <p className="text-sm text-emerald-400">✓ Files validated and ready for analysis.</p>
            )}

            {analysisStatus === "processing" && (
              <p className="text-sm text-cyan-400">Uploading files and analyzing logs...</p>
            )}

            {analysisStatus === "completed" && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="font-medium text-emerald-400">✓ Log analysis completed successfully.</p>
                <p className="mt-1 text-sm text-slate-400">Review the investigation results below.</p>
              </div>
            )}

            {analysisStatus === "error" && (
              <p className="mt-3 text-sm text-red-400">Analysis failed. Check the error message and try again.</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analysisStatus === "processing"}
            className="mt-5 w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {analysisStatus === "processing"
              ? "Analyzing Logs..."
              : "Analyze Logs →"}
          </button>
        </div>
      )}

      {analysisResults && analysisStatus === "completed" && (
        <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-950 p-5">
          <h3 className="text-xl font-bold text-white">🔍 Investigation Results</h3>
          <p className="mt-2 text-sm text-emerald-400">{analysisResults.message}</p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["HIGH", "MEDIUM", "LOW"].map((severity) => {
              const count = analysisFiles.reduce((total, file) => {
                const events = Array.isArray(file.suspicious_events)
                  ? file.suspicious_events
                  : [];

                return (
                  total +
                  events.filter(
                    (event) =>
                      String(event.severity || "").toUpperCase() === severity
                  ).length
                );
              }, 0);

              const cardClass =
                severity === "HIGH"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : severity === "MEDIUM"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

              return (
                <div
                  key={severity}
                  className={`rounded-lg border p-4 ${cardClass}`}
                >
                  <p className="text-sm font-medium">{severity} Severity</p>
                  <p className="mt-2 text-2xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>

          {analysisFiles.length > 0 ? (
            analysisFiles.map((item, index) => {
              const events = Array.isArray(item.suspicious_events)
                ? item.suspicious_events
                : [];

              const repeatedFailure = item.repeated_failure;

              return (
                <div
                  key={`${item.stored_name || item.original_name || "file"}-${index}`}
                  className="mt-5 rounded-xl border border-slate-700 bg-slate-900 p-4"
                >
                  <h4 className="break-all text-lg font-semibold text-white">📄 {item.original_name || "Uploaded log file"}</h4>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-sm text-slate-400">Total Log Lines</p>
                      <p className="mt-1 text-2xl font-bold text-white">{item.total_lines ?? 0}</p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4">
                      <p className="text-sm text-slate-400">Suspicious Events</p>
                      <p className="mt-1 text-2xl font-bold text-amber-400">{events.length}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h5 className="font-semibold text-white">Detected Security Events</h5>
                    {events.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {events.map((event, eventIndex) => (
                          <div
                            key={`${event.event_type || "event"}-${event.line_number ?? eventIndex}-${eventIndex}`}
                            className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-amber-300">
                                {formatEventType(event.event_type)}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getSeverityClass(event.severity)}`}
                              >
                                {event.severity || "UNKNOWN"}
                              </span>
                            </div>

                            <p className="mt-3 text-sm text-slate-400">Line Number: {event.line_number ?? "Unknown"}</p>
                            <p className="mt-2 break-words text-sm text-slate-200">{event.message || "No event details provided."}</p>

                            {event.matched_pattern && (
                              <p className="mt-2 break-words text-xs text-cyan-300">Matched Pattern: {event.matched_pattern}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-400">No suspicious events detected by the current rules.</p>
                    )}
                  </div>

                  <div className="mt-5 rounded-lg border border-slate-700 p-4">
                    <h5 className="font-semibold text-white">Repeated Login Failure Check</h5>

                    {repeatedFailure ? (
                      <div className="mt-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getSeverityClass(repeatedFailure.severity)}`}
                        >
                          {repeatedFailure.severity || "UNKNOWN"}
                        </span>

                        <p className="mt-3 font-medium text-red-300">{formatEventType(repeatedFailure.event_type)}</p>
                        <p className="mt-2 text-sm text-slate-300">Failed attempts:{" "} {repeatedFailure.failed_attempts ?? "Unknown"}</p>
                        <p className="mt-2 text-sm text-slate-400">{repeatedFailure.message ||"Repeated login failures detected."}</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-emerald-400">No repeated login failure threshold reached.</p>
                    )}
                  </div>
                  
  <div className="mt-5 rounded-lg border border-cyan-500/30 bg-slate-900/70 p-4">
    <h5 className="text-lg font-bold text-cyan-400">AI Investigation Report</h5>

    {item.ai_analysis ? (
      <div className="mt-4 space-y-5">

        <div>
          <h6 className="font-semibold text-white">Investigation Summary</h6>
          <p className="mt-2 text-sm leading-6 text-slate-300">{item.ai_analysis.investigation_summary ||"No summary available."}</p>
        </div>

      <div>
        <h6 className="font-semibold text-white">Possible Attack Classification</h6>
        <p className="mt-2 text-sm text-slate-300">{item.ai_analysis.attack_classification ||"Undetermined"}</p>
      </div>

      <div>
        <h6 className="mb-2 font-semibold text-white">AI-Assessed Risk Level</h6>

        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getSeverityClass(
            item.ai_analysis.risk_level
          )}`}
        >
          {item.ai_analysis.risk_level || "UNKNOWN"}
        </span>
      </div>

      <div>
        <h6 className="font-semibold text-white">Evidence Observed</h6>

        {Array.isArray(item.ai_analysis.evidence) &&
        item.ai_analysis.evidence.length > 0 ? (
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
            {item.ai_analysis.evidence.map((evidence, index) => (
              <li key={index}>{evidence}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No evidence details available.</p>
        )}
      </div>

      <div>
        <h6 className="font-semibold text-white">AI Explanation</h6>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">{item.ai_analysis.explanation ||"No explanation available."}</p>
      </div>

      <div>
        <h6 className="font-semibold text-white">Recommended Actions</h6>

        {Array.isArray(item.ai_analysis.recommended_actions) &&
        item.ai_analysis.recommended_actions.length > 0 ? (
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-emerald-300">
            {item.ai_analysis.recommended_actions.map(
              (action, index) => (
                <li key={index}>{action}</li>
              )
            )}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No recommendations available.</p>
        )}
      </div>

      <div>
        <h6 className="font-semibold text-white">Analysis Limitations</h6>

        {Array.isArray(item.ai_analysis.limitations) &&
        item.ai_analysis.limitations.length > 0 ? (
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-amber-300">
            {item.ai_analysis.limitations.map(
              (limitation, index) => (
                <li key={index}>{limitation}</li>
              )
            )}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No limitations reported.</p>
        )}
      </div>

      <p className="border-t border-slate-700 pt-3 text-xs text-slate-500">AI findings are investigative suggestions, not proof of a confirmed attack. Verify them against the original logs.</p>
    </div>
  ) : (
    <p className="mt-3 text-sm text-slate-400">AI analysis report is unavailable for this file.</p>
  )}
</div>
                </div>
              );
            })
          ) : (
            <p className="mt-5 rounded-lg bg-slate-800 p-4 text-sm text-slate-400">The backend returned no individual file analysis results.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadZone;