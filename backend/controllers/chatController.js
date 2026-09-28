const rateLimit = require('express-rate-limit');
const Document = require('../models/Document');
const Chat = require('../models/Chat');
const { generateRAGAnswer } = require('../services/ragService');

// AI endpoint rate limit — 30 chat requests per user per minute
const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user._id.toString(),
  message: { success: false, error: 'Too many requests. Please wait before sending another message.' },
});

// ─── Ask a Question ───────────────────────────────────────────────────────────

// @route   POST /api/chat
// @access  Private
const askQuestion = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, error: 'documentId is required.' });
    }
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Question cannot be empty.' });
    }
    if (question.length > 2000) {
      return res.status(400).json({ success: false, error: 'Question exceeds maximum length of 2000 characters.' });
    }

    // Verify document exists and belongs to this user
    const document = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }
    if (document.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: `Document is not ready. Current status: ${document.status}. Please wait for processing to complete.`,
      });
    }

    // Run the RAG pipeline
    const { answer, sources, retrievedChunks } = await generateRAGAnswer({
      question: question.trim(),
      userId: req.user._id.toString(),
      documentId: documentId.toString(),
    });

    // Persist message pair to chat history (upsert — one chat per user+document)
    const userMessage = {
      role: 'user',
      content: question.trim(),
      sources: [],
      timestamp: new Date(),
    };
    const assistantMessage = {
      role: 'assistant',
      content: answer,
      sources,
      timestamp: new Date(),
    };

    await Chat.findOneAndUpdate(
      { userId: req.user._id, documentId },
      { $push: { messages: { $each: [userMessage, assistantMessage] } } },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      answer,
      sources,
      retrievedChunks,
    });
  } catch (error) {
    console.error('[CHAT] askQuestion error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate answer.' });
  }
};

// ─── Get Chat History ─────────────────────────────────────────────────────────

// @route   GET /api/chat/:documentId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Verify document ownership
    const document = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    const chat = await Chat.findOne({ userId: req.user._id, documentId });
    if (!chat) {
      return res.json({ success: true, messages: [] });
    }

    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    console.error('[CHAT] getChatHistory error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch chat history.' });
  }
};

// ─── Clear Chat History ───────────────────────────────────────────────────────

// @route   DELETE /api/chat/:documentId
// @access  Private
const clearChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Verify document ownership
    const document = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    await Chat.findOneAndDelete({ userId: req.user._id, documentId });

    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (error) {
    console.error('[CHAT] clearChatHistory error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to clear chat history.' });
  }
};

module.exports = { chatRateLimit, askQuestion, getChatHistory, clearChatHistory };
