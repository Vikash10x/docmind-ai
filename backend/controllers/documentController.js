const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const { extractTextFromPDF } = require('../services/pdfService');
const { chunkDocumentPages } = require('../utils/chunkText');
const { generateEmbeddings } = require('../services/embeddingService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage — safe unique filenames
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, _file, cb) => {
    const uniqueId = crypto.randomBytes(12).toString('hex');
    cb(null, `${Date.now()}-${uniqueId}.pdf`);
  },
});

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB) || 10;

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

// ─── Upload & Process PDF ────────────────────────────────────────────────────

// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No PDF file provided.' });
  }

  const { originalname, filename, path: filePath, size } = req.file;

  // Create document record immediately (status: processing)
  let document;
  try {
    document = await Document.create({
      userId: req.user._id,
      fileName: filename,
      originalName: originalname,
      filePath,
      fileSize: size,
      mimeType: 'application/pdf',
      status: 'processing',
    });
  } catch (err) {
    // Clean up uploaded file if DB write fails
    fs.unlink(filePath, () => {});
    return res.status(500).json({ success: false, error: 'Failed to save document record.' });
  }

  // Process asynchronously — respond quickly, then do heavy lifting
  // (In production this would be a background job queue like Bull/BullMQ)
  processDocument(document, req.user._id).catch((err) => {
    console.error(`[DOC] Background processing failed for ${document._id}:`, err.message);
  });

  res.status(202).json({
    success: true,
    message: 'Document uploaded. Processing started.',
    document: {
      id: document._id,
      name: originalname,
      status: 'processing',
      fileSize: size,
    },
  });
};

/**
 * Heavy processing pipeline: PDF extraction → chunking → embeddings → storage.
 * Runs in the background after the upload response is sent.
 */
const processDocument = async (document, userId) => {
  try {
    console.log(`[DOC] Processing document: ${document.originalName}`);

    // Step 1: Extract text from PDF
    const { pages, totalPages } = await extractTextFromPDF(document.filePath);

    // Step 2: Chunk the extracted text
    const chunks = chunkDocumentPages(pages);
    console.log(`[DOC] Created ${chunks.length} chunks from ${totalPages} pages.`);

    if (chunks.length === 0) {
      throw new Error('No text chunks could be created from this document.');
    }

    // Step 3: Generate embeddings for all chunks
    const chunkTexts = chunks.map((c) => c.text);
    const embeddings = await generateEmbeddings(chunkTexts);

    // Step 4: Bulk insert chunks + embeddings into MongoDB
    const chunkDocs = chunks.map((chunk, idx) => ({
      userId,
      documentId: document._id,
      text: chunk.text,
      embedding: embeddings[idx],
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      metadata: { originalName: document.originalName },
    }));

    await DocumentChunk.insertMany(chunkDocs);

    // Step 5: Update document record as completed
    await Document.findByIdAndUpdate(document._id, {
      status: 'completed',
      totalPages,
      totalChunks: chunks.length,
    });

    console.log(`[DOC] ✅ Document processed: ${document.originalName} (${chunks.length} chunks, ${totalPages} pages)`);
  } catch (error) {
    console.error(`[DOC] ❌ Processing failed for ${document.originalName}:`, error.message);

    // Mark document as failed
    await Document.findByIdAndUpdate(document._id, {
      status: 'failed',
      errorMessage: error.message,
    });

    // Clean up any partial chunk data
    await DocumentChunk.deleteMany({ documentId: document._id });
  }
};

// ─── List Documents ───────────────────────────────────────────────────────────

// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('-filePath -__v')
      .sort({ createdAt: -1 });

    res.json({ success: true, documents });
  } catch (error) {
    console.error('[DOC] getDocuments error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch documents.' });
  }
};

// ─── Get Single Document ──────────────────────────────────────────────────────

// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id, // Ownership check
    }).select('-filePath -__v');

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    res.json({ success: true, document });
  } catch (error) {
    console.error('[DOC] getDocument error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch document.' });
  }
};

// ─── Delete Document ──────────────────────────────────────────────────────────

// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id, // Ownership check
    });

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    // Delete all associated chunks and embeddings
    await DocumentChunk.deleteMany({ documentId: document._id });

    // Delete physical PDF file
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlink(document.filePath, (err) => {
        if (err) console.warn(`[DOC] Could not delete file ${document.filePath}:`, err.message);
      });
    }

    // Delete the document record
    await Document.findByIdAndDelete(document._id);

    res.json({ success: true, message: 'Document and all associated data deleted successfully.' });
  } catch (error) {
    console.error('[DOC] deleteDocument error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete document.' });
  }
};

// ─── Get Processing Status ────────────────────────────────────────────────────

// @route   GET /api/documents/:id/status
// @access  Private
const getDocumentStatus = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select('status totalPages totalChunks errorMessage originalName');

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    res.json({ success: true, document });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch status.' });
  }
};

module.exports = {
  upload,
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  getDocumentStatus,
};
