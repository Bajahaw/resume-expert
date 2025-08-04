import jsPDF from "jspdf";

interface PDFOptions {
  title?: string;
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
}

export const generateCoverLetterPDF = (
  content: string,
  options: PDFOptions = {},
): void => {
  const {
    title = "Cover Letter",
    fontSize = 12,
    lineHeight = 6,
    margin = 20,
  } = options;

  // Create new PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  // Set font
  pdf.setFont("Arial", "normal");
  pdf.setFontSize(fontSize);

  // Split content into lines that fit the page width
  const lines = pdf.splitTextToSize(content, maxWidth);

  let yPosition = margin * 2;

  // Add each line to the PDF
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page
    if (yPosition + lineHeight > maxHeight) {
      pdf.addPage();
      yPosition = margin;
    }

    // Add the line of text
    pdf.text(lines[i], margin, yPosition);
    yPosition += lineHeight;
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `${title.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.pdf`;

  // Save the PDF
  pdf.save(filename);
};

export const generatePDFBlob = (
  content: string,
  options: PDFOptions = {},
): Blob => {
  const { fontSize = 12, lineHeight = 6, margin = 20 } = options;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(fontSize);

  const lines = pdf.splitTextToSize(content, maxWidth);

  let yPosition = margin * 2;

  for (let i = 0; i < lines.length; i++) {
    if (yPosition + lineHeight > maxHeight) {
      pdf.addPage();
      yPosition = margin * 2;
    }

    pdf.text(lines[i], margin, yPosition);
    yPosition += lineHeight;
  }

  // Return as blob instead of saving
  return pdf.output("blob");
};
