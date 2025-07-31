export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://ai.radhi.tech",
  ENDPOINTS: {
    ANALYZE: "/api/analyze",
    GENERATE: "/api/generate",
    PDF: "/api/pdf",
  },
} as const;

export const createApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
