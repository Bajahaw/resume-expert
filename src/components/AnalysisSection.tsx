import React, { useState } from "react";
import { createApiUrl, API_CONFIG } from "../config/api";

interface AnalysisResult {
  breakdown: {
    keywordMatch: number;
    experienceRelevance: number;
    skillAlignment: number;
    overall: number;
  };
  keywordAnalysis: {
    missing: string[];
    present: string[];
  };
  suggestions: string[];
}

interface AnalysisSectionProps {
  resume: string;
  jobDescription: string;
}

const ChartBarIcon: React.FC<{ className?: string }> = ({
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
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
    />
  </svg>
);

const LightBulbIcon: React.FC<{ className?: string }> = ({
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18a2.25 2.25 0 0 0-2.25-2.25M14.25 18a2.25 2.25 0 0 1-2.25 2.25M14.25 18a2.25 2.25 0 0 0 2.25-2.25M14.25 18a2.25 2.25 0 0 1 2.25 2.25M9.75 18a2.25 2.25 0 0 0 2.25-2.25M9.75 18a2.25 2.25 0 0 1-2.25 2.25m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const TagIcon: React.FC<{ className?: string }> = ({
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
      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6h.008v.008H6V6Z"
    />
  </svg>
);

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  return (
    <div
      className={`rounded-xl p-6 ${getScoreBgColor(score)} border border-gray-200 dark:border-gray-700`}
    >
      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}
        </div>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Match Score
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          out of 100
        </div>
      </div>
    </div>
  );
};

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  resume,
  jobDescription,
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.ANALYZE), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resume.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during analysis",
      );
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze =
    resume.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <ChartBarIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Resume Analysis
        </h2>
      </div>

      <div className="space-y-6">
        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Analyzing...
              </>
            ) : (
              <>
                <ChartBarIcon className="w-5 h-5" />
                Analyze Resume
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

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Score Display */}
            <ScoreDisplay score={analysis.breakdown.overall} />

            {/* Detailed Score Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Score Breakdown
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {analysis.breakdown.keywordMatch}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Keyword Match
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {analysis.breakdown.experienceRelevance}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Experience Relevance
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {analysis.breakdown.skillAlignment}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Skill Alignment
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Keywords Section */}
            {analysis.keywordAnalysis.missing.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                    Missing Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.missing.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Present Keywords Section */}
            {analysis.keywordAnalysis.present.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <TagIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Found Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.present.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions Section */}
            {analysis.suggestions.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-4">
                  <LightBulbIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    Improvement Suggestions
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-purple-800 dark:text-purple-200"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center text-xs font-semibold text-purple-800 dark:text-purple-200 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!analysis && !loading && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Fill in both your resume and the job description above, then click
              "Analyze Resume" to get:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Overall compatibility score and detailed breakdown</li>
              <li>• Missing keywords that should be included</li>
              <li>• Keywords already found in your resume</li>
              <li>• Specific improvement suggestions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
