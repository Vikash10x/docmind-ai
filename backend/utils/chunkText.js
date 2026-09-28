/**
 * Text chunking utility.
 *
 * Strategy:
 * 1. Split text into paragraphs (double newlines)
 * 2. Accumulate paragraphs into chunks up to CHUNK_SIZE
 * 3. If a paragraph itself exceeds CHUNK_SIZE, split by sentences
 * 4. Apply CHUNK_OVERLAP by carrying forward the last N characters of the previous chunk
 *
 * This approach respects natural document structure far better than naive
 * character-count splitting.
 */

/**
 * Split text into semantic chunks.
 * @param {string} text
 * @param {number} chunkSize  - Target max chars per chunk (default: env CHUNK_SIZE)
 * @param {number} chunkOverlap - Overlap chars carried into next chunk (default: env CHUNK_OVERLAP)
 * @returns {string[]}
 */
const chunkText = (text, chunkSize, chunkOverlap) => {
  const size = chunkSize || parseInt(process.env.CHUNK_SIZE) || 1000;
  const overlap = chunkOverlap || parseInt(process.env.CHUNK_OVERLAP) || 200;

  if (!text || text.trim().length === 0) return [];

  const chunks = [];

  // Split by paragraph boundaries (one or more blank lines)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  let currentChunk = '';

  const flushChunk = () => {
    const trimmed = currentChunk.trim();
    if (trimmed.length > 0) {
      chunks.push(trimmed);
    }
  };

  const addOverlap = () => {
    // Carry last `overlap` characters into the new chunk for context continuity
    if (currentChunk.length > overlap) {
      return currentChunk.slice(-overlap);
    }
    return currentChunk;
  };

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // If adding this paragraph would exceed chunk size, flush and start new
    if (currentChunk.length > 0 && currentChunk.length + trimmedParagraph.length + 2 > size) {
      flushChunk();
      currentChunk = addOverlap();
      if (currentChunk) currentChunk += '\n\n';
    }

    // If a single paragraph exceeds chunk size, break it by sentences
    if (trimmedParagraph.length > size) {
      // Flush whatever we have first
      if (currentChunk.trim().length > 0) {
        flushChunk();
        currentChunk = addOverlap();
        if (currentChunk) currentChunk += ' ';
      }

      // Split paragraph into sentences
      const sentences = trimmedParagraph.split(/(?<=[.!?;])\s+/);
      for (const sentence of sentences) {
        if (!sentence.trim()) continue;
        if (currentChunk.length + sentence.length + 1 > size && currentChunk.trim().length > 0) {
          flushChunk();
          currentChunk = addOverlap();
          if (currentChunk) currentChunk += ' ';
        }
        currentChunk += (currentChunk.trim() ? ' ' : '') + sentence.trim();
      }
    } else {
      currentChunk += (currentChunk.trim() ? '\n\n' : '') + trimmedParagraph;
    }
  }

  // Flush the final chunk
  flushChunk();

  return chunks;
};

/**
 * Chunk page-aware document content.
 * Takes the structured page output from pdfService and returns chunks
 * each tagged with their source page number.
 *
 * @param {Array<{pageNumber: number, text: string}>} pages
 * @param {number} chunkSize
 * @param {number} chunkOverlap
 * @returns {Array<{text: string, pageNumber: number, chunkIndex: number}>}
 */
const chunkDocumentPages = (pages, chunkSize, chunkOverlap) => {
  const allChunks = [];
  let globalChunkIndex = 0;

  for (const { pageNumber, text } of pages) {
    const pageChunks = chunkText(text, chunkSize, chunkOverlap);
    for (const chunkContent of pageChunks) {
      allChunks.push({
        text: chunkContent,
        pageNumber,
        chunkIndex: globalChunkIndex++,
      });
    }
  }

  return allChunks;
};

module.exports = { chunkText, chunkDocumentPages };
