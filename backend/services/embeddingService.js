/**
 * Embedding Service — Gemini text-embedding-004
 *
 * text-embedding-004 produces 768-dimensional embeddings.
 * This matches the vector index dimension configured in MongoDB Atlas.
 *
 * Functions:
 *   generateEmbedding(text)        → number[]
 *   generateEmbeddings(texts)      → number[][]
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGenAI = () => {
  const rawKey = process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.trim().replace(/^[\["']+|[\]"']+$/g, '');
  if (!apiKey || apiKey === 'GCP_API_KEY' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please set a valid Gemini API key in backend/.env.');
  }
  return new GoogleGenerativeAI(apiKey);
};
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

// Small delay helper to avoid hitting Gemini rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate an embedding vector for a single text string.
 * @param {string} text
 * @returns {Promise<number[]>} 768-dimensional embedding vector
 */
const generateEmbedding = async (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot generate embedding for empty text.');
  }

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    // Trim text to avoid exceeding token limits (embedding models typically allow ~8192 tokens)
    const trimmedText = text.slice(0, 25000);
    const result = await model.embedContent({
      content: { parts: [{ text: trimmedText }] },
      outputDimensionality: 768,
    });
    return result.embedding.values;
  } catch (error) {
    console.error(`[EMBEDDING] Error generating embedding: ${error.message}`);
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

/**
 * Generate embeddings for an array of text strings.
 * Processes in batches to avoid rate limiting.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
const generateEmbeddings = async (texts) => {
  if (!texts || texts.length === 0) return [];

  const BATCH_SIZE = 5; // Process 5 at a time to stay within rate limits
  const BATCH_DELAY_MS = 500; // 500ms between batches
  const allEmbeddings = [];

  console.log(`[EMBEDDING] Generating embeddings for ${texts.length} chunks...`);

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const batchEmbeddings = await Promise.all(
      batch.map((text) => generateEmbedding(text))
    );
    allEmbeddings.push(...batchEmbeddings);

    console.log(`[EMBEDDING] Processed ${Math.min(i + BATCH_SIZE, texts.length)}/${texts.length} chunks`);

    // Delay between batches (not after the last batch)
    if (i + BATCH_SIZE < texts.length) {
      await delay(BATCH_DELAY_MS);
    }
  }

  return allEmbeddings;
};

module.exports = { generateEmbedding, generateEmbeddings };
