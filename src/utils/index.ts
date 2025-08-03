// File handling utilities
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    };
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsText(file);
  });
};

// PDF.js initialization utility
const initializePDFJS = async () => {
  const pdfjsLib = await import("pdfjs-dist");

  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
      // First attempt: Use bundled worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
    } catch {
      try {
        // Second attempt: Use local public worker file
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      } catch {
        // Third attempt: Use CDN with correct version
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }
    }
  }

  return pdfjsLib;
};

// PDF text extraction utility with fallback worker options
export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        // Initialize PDF.js with proper worker setup
        const pdfjsLib = await initializePDFJS();

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n";
        }

        resolve(fullText.trim());
      } catch (error) {
        reject(new Error(handlePDFError(error)));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read PDF file"));
    reader.readAsArrayBuffer(file);
  });
};

// Alternative PDF extraction function using local worker
export const extractTextFromPDFLocal = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;

        // Initialize PDF.js with local worker
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          fullText += pageText + "\n";
        }

        resolve(fullText.trim());
      } catch (error) {
        reject(new Error(handlePDFError(error)));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read PDF file"));
    reader.readAsArrayBuffer(file);
  });
};

// Universal file text extraction (handles both text and PDF files)
export const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "application/pdf") {
    try {
      return await extractTextFromPDF(file);
    } catch (error) {
      console.warn(
        "Primary PDF extraction failed, trying alternative method:",
        error,
      );
      try {
        return await extractTextFromPDFLocal(file);
      } catch (fallbackError) {
        const errorMessage = handlePDFError(fallbackError);
        throw new Error(errorMessage);
      }
    }
  } else if (
    file.type === "text/plain" ||
    file.name.toLowerCase().endsWith(".txt")
  ) {
    return readFileAsText(file);
  } else {
    throw new Error("Unsupported file type. Please use .txt or .pdf files.");
  }
};

export const isValidFileType = (
  file: File,
  allowedTypes: string[],
): boolean => {
  return (
    allowedTypes.includes(file.type) ||
    allowedTypes.some((type) =>
      file.name.toLowerCase().endsWith(type.replace("*", "")),
    )
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// API utilities
export const apiCall = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API call failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response as unknown as T;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

export const extractKeywords = (text: string): string[] => {
  // Simple keyword extraction - remove common words and extract meaningful terms
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "through",
    "during",
    "before",
    "after",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.has(word))
    .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
    .slice(0, 50); // Limit to 50 keywords
};

export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .trim();
};

// Local storage utilities
export const storage = {
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  },

  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return defaultValue || null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove from localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  },
};

// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone utility
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;
  if (typeof obj === "object") {
    const clonedObj = {} as { [key: string]: unknown };
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return clonedObj as T;
  }
  return obj;
};

// Error handling utilities
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

// PDF-specific error handler
export const handlePDFError = (error: unknown): string => {
  const errorMessage = handleError(error);

  if (errorMessage.includes("Setting up fake worker failed")) {
    return "PDF worker failed to load. Please try refreshing the page or use a .txt file instead.";
  }

  if (errorMessage.includes("worker") || errorMessage.includes("Worker")) {
    return "PDF processing worker error. Try using a different PDF or convert it to text format.";
  }

  if (errorMessage.includes("dynamically imported module")) {
    return "PDF library loading failed. Please check your internet connection and try again.";
  }

  if (
    errorMessage.includes("InvalidPDFException") ||
    errorMessage.includes("PDF")
  ) {
    return "The PDF file appears to be corrupted or invalid. Please try a different file.";
  }

  return `PDF processing failed: ${errorMessage}`;
};

// PDF.js debug utility
export const debugPDFJS = async (): Promise<{
  version: string;
  workerSrc: string;
  workerAvailable: boolean;
  errorDetails?: string;
}> => {
  try {
    const pdfjsLib = await import("pdfjs-dist");

    const result = {
      version: pdfjsLib.version,
      workerSrc: pdfjsLib.GlobalWorkerOptions.workerSrc || "Not set",
      workerAvailable: false,
      errorDetails: undefined as string | undefined,
    };

    // Test if worker can be loaded
    try {
      const testWorkerSrc =
        pdfjsLib.GlobalWorkerOptions.workerSrc || "/pdf.worker.min.mjs";
      const response = await fetch(testWorkerSrc, { method: "HEAD" });
      result.workerAvailable = response.ok;
      if (!response.ok) {
        result.errorDetails = `Worker file not accessible: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      result.errorDetails = `Worker accessibility test failed: ${error}`;
    }

    return result;
  } catch (error) {
    return {
      version: "Unknown",
      workerSrc: "Failed to load",
      workerAvailable: false,
      errorDetails: `PDF.js import failed: ${error}`,
    };
  }
};

// Class name utility (similar to clsx)
export const cn = (
  ...args: (string | undefined | null | boolean)[]
): string => {
  return args.filter(Boolean).join(" ").trim();
};

// Simple markdown parser for basic formatting
export const parseMarkdown = (text: string): string => {
  if (!text) return "";

  return (
    text
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mb-4 mt-8">$1</h1>',
      )

      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, "<br>")

      // Wrap in paragraph tags
      .replace(/^(.+)/, '<p class="mb-4">$1')
      .replace(/(.+)$/, "$1</p>")
  );
};

// Convert markdown to React-safe HTML
export const markdownToHtml = (markdown: string): { __html: string } => {
  return { __html: parseMarkdown(markdown) };
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Check if device is mobile
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

// Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};
