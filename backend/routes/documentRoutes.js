const express = require('express');
const router = express.Router();
const {
  upload,
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  getDocumentStatus,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// All document routes require authentication
router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.get('/:id/status', getDocumentStatus);
router.delete('/:id', deleteDocument);

module.exports = router;
