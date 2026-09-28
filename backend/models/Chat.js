const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sources: [
    {
      documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
      fileName: String,
      pageNumber: Number,
      score: Number,
      chunkText: String,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
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
    messages: [messageSchema],
  },
  { timestamps: true }
);

// One chat session per user per document
chatSchema.index({ userId: 1, documentId: 1 }, { unique: true });

module.exports = mongoose.model('Chat', chatSchema);
