import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { ResumeSection } from "./components/ResumeSection";
import { JobDescriptionSection } from "./components/JobDescriptionSection";
import { AnalysisSection } from "./components/AnalysisSection";
import { CoverLetterSection } from "./components/CoverLetterSection";

const App: React.FC = () => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Resume Expert
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Optimize Your Resume & Generate Cover Letters
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Upload your resume and job description to get AI-powered
                analysis, keyword recommendations, and personalized cover
                letters.
              </p>
            </div>

            {/* Resume Section */}
            <ResumeSection value={resume} onChange={setResume} />

            {/* Job Description Section */}
            <JobDescriptionSection
              value={jobDescription}
              onChange={setJobDescription}
            />

            {/* Analysis Section */}
            <AnalysisSection resume={resume} jobDescription={jobDescription} />

            {/* Cover Letter Section */}
            <CoverLetterSection
              resume={resume}
              jobDescription={jobDescription}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Built with React, TypeScript, and Tailwind CSS
              </p>
              <div className="mt-4 flex justify-center space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Privacy</span>
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Terms</span>
                  Terms
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Support</span>
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
