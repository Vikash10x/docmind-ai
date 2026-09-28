/**
 * Vector Search Service — MongoDB Atlas Vector Search
 *
 * Uses the $vectorSearch aggregation stage to find semantically similar
 * document chunks. Enforces user isolation by always filtering by userId.
 *
 * IMPORTANT: You must create a Vector Search index in MongoDB Atlas before
 * this will work. See README.md → "MongoDB Atlas Vector Search Setup".
 *
 * Required index definition (create in Atlas UI under Search → Create Index):
 * {
 *   "fields": [
 *     { "type": "vector", "path": "embedding", "numDimensions": 768, "similarity": "cosine" },
 *     { "type": "filter", "path": "userId" },
 *     { "type": "filter", "path": "documentId" }
 *   ]
 * }
 */
const mongoose = require('mongoose');
const DocumentChunk = require('../models/DocumentChunk');
const Document = require('../models/Document');

const VECTOR_INDEX_NAME = process.env.VECTOR_INDEX_NAME || 'vector_index';

/**
 * Search for semantically similar chunks using Atlas Vector Search.
 *
 * @param {object} params
 * @param {number[]} params.queryEmbedding   - The query vector (768-dim)
 * @param {string}  params.userId            - Authenticated user ID (enforces ownership)
 * @param {string}  [params.documentId]      - Optional: limit search to a specific document
 * @param {number}  [params.limit]           - Number of results to return (default: TOP_K env)
 *
 * @returns {Promise<Array>} Ranked chunks with text, page, document, and score
 */
const searchSimilarChunks = async ({ queryEmbedding, userId, documentId, limit }) => {
  const topK = limit || parseInt(process.env.TOP_K) || 5;

  // Build the pre-filter (must be indexed as "filter" fields in the Atlas index)
  const preFilter = {
    userId: { $eq: new mongoose.Types.ObjectId(userId) },
  };
  if (documentId) {
    preFilter.documentId = { $eq: new mongoose.Types.ObjectId(documentId) };
  }

  try {
    const results = await DocumentChunk.aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: topK * 15, // Oversample for better recall
          limit: topK,
          filter: preFilter,
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          pageNumber: 1,
          documentId: 1,
          chunkIndex: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    if (results.length === 0) {
      return [];
    }

    // Enrich results with document metadata (fileName)
    const documentIds = [...new Set(results.map((r) => r.documentId.toString()))];
    const documents = await Document.find({ _id: { $in: documentIds } }).select('fileName originalName');
    const docMap = {};
    for (const doc of documents) {
      docMap[doc._id.toString()] = doc;
    }

    return results.map((chunk) => ({
      chunkId: chunk._id,
      text: chunk.text,
      pageNumber: chunk.pageNumber,
      documentId: chunk.documentId,
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
      fileName: docMap[chunk.documentId.toString()]?.originalName || 'Unknown',
    }));
  } catch (error) {
    // Provide a helpful error message if the Atlas index is not configured
    if (error.message && error.message.includes('$vectorSearch')) {
      throw new Error(
        'Vector Search is not configured. Please create a Vector Search index in MongoDB Atlas. ' +
        'See README.md → "MongoDB Atlas Vector Search Setup" for instructions.'
      );
    }
    console.error('[VECTOR_SEARCH] Error:', error.message);
    throw new Error(`Vector search failed: ${error.message}`);
  }
};

module.exports = { searchSimilarChunks };
