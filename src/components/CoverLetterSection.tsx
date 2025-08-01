import React, { useState } from "react";
import { createApiUrl, API_CONFIG } from "../config/api";
import { markdownToHtml } from "../utils";

interface CoverLetterSectionProps {
  resume: string;
  jobDescription: string;
}

const DocumentTextIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

const ClipboardIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
    />
  </svg>
);

const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

export const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({
  resume,
  jobDescription,
}) => {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        createApiUrl(API_CONFIG.ENDPOINTS.GENERATE),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: resume.trim(),
            jobDescription: jobDescription.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      setCoverLetter(result.letter || "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during generation",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = coverLetter;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed:", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadPDF = async () => {
    if (!coverLetter) return;

    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.PDF), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: coverLetter,
          title: "Cover Letter",
        }),
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF download failed:", err);
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    }
  };

  const canGenerate =
    resume.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Cover Letter Generator
        </h2>
      </div>

      <div className="space-y-6">
        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <DocumentTextIcon className="w-5 h-5" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Cover Letter Display */}
        {coverLetter && (
          <div className="space-y-4">
            {/* Cover Letter Content */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={markdownToHtml(coverLetter)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCopyToClipboard}
                className="btn-secondary inline-flex items-center gap-2 justify-center"
              >
                {copySuccess ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadPDF}
                className="btn-primary inline-flex items-center gap-2 justify-center"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!coverLetter && !loading && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Fill in both your resume and the job description above, then click
              "Generate Cover Letter" to create a personalized cover letter
              that:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Highlights relevant experience from your resume</li>
              <li>• Addresses specific job requirements</li>
              <li>• Uses professional formatting and tone</li>
              <li>• Can be copied or downloaded as PDF</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
