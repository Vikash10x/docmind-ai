const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    // Stored as array of numbers for Atlas Vector Search
    // text-embedding-004 produces 768-dimensional vectors
    embedding: {
      type: [Number],
      required: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound index for efficient user+document queries
documentChunkSchema.index({ userId: 1, documentId: 1 });

module.exports = mongoose.model('DocumentChunk', documentChunkSchema);
