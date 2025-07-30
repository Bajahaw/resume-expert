import React, { useState, useRef } from "react";
import { extractTextFromFile } from "../utils";

interface ResumeSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const DocumentIcon: React.FC<{ className?: string }> = ({
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
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-4.5B1.125 6.375 0 7.5 0 9v2.625m19.5 2.25v.375a3.375 3.375 0 0 1-3.375 3.375h-4.5a3.375 3.375 0 0 1-3.375-3.375V14.25M9 9.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v.75m0 0h3m-3 0v3m0-3h-3m3 0v-3"
    />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({
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
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    />
  </svg>
);

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  value,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (
      file.type === "text/plain" ||
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      try {
        const text = await extractTextFromFile(file);
        onChange(text);
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Error reading file. Please try again.");
      }
    } else {
      alert("Please upload a .txt or .pdf file");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <DocumentIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Resume
        </h2>
      </div>

      <div className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop your resume here, or
              </p>
              <button
                type="button"
                onClick={handleUploadClick}
                className="btn-primary inline-flex items-center gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                Choose File
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supports .txt and .pdf files
            </p>
          </div>
        </div>

        {/* Text Input Area */}
        <div>
          <label
            htmlFor="resume-text"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Or paste your resume text:
          </label>
          <textarea
            id="resume-text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your resume content here..."
            rows={12}
            className="textarea-field"
          />
        </div>

        {value && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Character count: {value.length}
          </div>
        )}
      </div>
    </div>
  );
};
