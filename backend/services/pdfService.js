/**
 * PDF Service — Text extraction using pdfjs-dist (legacy build for Node.js).
 * Preserves page numbers and returns structured page data.
 *
 * pdfjs-dist v3.x legacy build works in Node.js without a DOM.
 */
const fs = require('fs');
const path = require('path');

// Use the legacy CJS build which supports Node.js environments
let pdfjsLib;
try {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  // Disable the worker — not needed for Node.js text extraction
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
} catch (err) {
  console.error('[PDF] Failed to load pdfjs-dist:', err.message);
  throw new Error('PDF library failed to initialize. Check pdfjs-dist installation.');
}

/**
 * Extract text from a PDF file, preserving page numbers.
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<Array<{pageNumber: number, text: string}>>}
 */
const extractTextFromPDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found at path: ${filePath}`);
  }

  const data = new Uint8Array(fs.readFileSync(filePath));

  let pdfDocument;
  try {
    const loadingTask = pdfjsLib.getDocument({ data });
    pdfDocument = await loadingTask.promise;
  } catch (err) {
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }

  const numPages = pdfDocument.numPages;
  const pages = [];
  let totalTextLength = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Join text items, preserving spaces between words
      const pageText = textContent.items
        .map((item) => {
          // item.str contains the text; item.hasEOL indicates line break
          return item.str + (item.hasEOL ? '\n' : '');
        })
        .join(' ')
        .replace(/\s{2,}/g, ' ')  // Collapse multiple spaces
        .trim();

      if (pageText.length > 0) {
        pages.push({ pageNumber: pageNum, text: pageText });
        totalTextLength += pageText.length;
      }
    } catch (pageErr) {
      console.warn(`[PDF] Warning: Could not extract text from page ${pageNum}: ${pageErr.message}`);
      // Continue to next page — don't fail entire extraction
    }
  }

  // If no text was extracted, the PDF is likely scanned/image-based
  if (totalTextLength === 0) {
    throw new Error(
      'No extractable text found in this PDF. The document appears to be image-based or scanned. ' +
      'OCR (Optical Character Recognition) is required to process such documents, which is not supported in this version.'
    );
  }

  console.log(`[PDF] Extracted text from ${pages.length}/${numPages} pages (${totalTextLength} chars)`);
  return { pages, totalPages: numPages };
};

module.exports = { extractTextFromPDF };
