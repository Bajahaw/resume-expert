// API Response Types
export interface AnalysisResponse {
  score: number;
  keywords: string[];
  enhancements: string[];
}

export interface CoverLetterResponse {
  coverLetter: string;
  letter?: string; // Alternative field name for flexibility
}

export interface PDFResponse {
  success: boolean;
  message?: string;
}

// Component Props Types
export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
}

export interface LoadingButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

// API Request Types
export interface AnalysisRequest {
  resume: string;
  jobDescription: string;
}

export interface CoverLetterRequest {
  resume: string;
  jobDescription: string;
}

export interface PDFRequest {
  content: string;
  title?: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Error Types
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

// File Types
export interface FileData {
  content: string;
  name: string;
  size: number;
  type: string;
}

// Utility Types
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type InputSize = 'sm' | 'md' | 'lg';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Analysis Result Types
export interface KeywordAnalysis {
  missing: string[];
  present: string[];
  suggestions: string[];
}

export interface ScoreBreakdown {
  keywordMatch: number;
  experienceRelevance: number;
  skillsAlignment: number;
  overall: number;
}

export interface DetailedAnalysisResponse extends AnalysisResponse {
  breakdown?: ScoreBreakdown;
  keywordAnalysis?: KeywordAnalysis;
  suggestions?: {
    additions: string[];
    modifications: string[];
    removals: string[];
  };
}

// Form Types
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'select';
  required?: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

// Storage Types
export interface StorageItem {
  key: string;
  value: any;
  timestamp: number;
  expiry?: number;
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  maxFileSize: number;
  supportedFileTypes: string[];
  features: {
    darkMode: boolean;
    fileUpload: boolean;
    pdfDownload: boolean;
    analytics: boolean;
  };
}
