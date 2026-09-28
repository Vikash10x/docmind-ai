const express = require('express');
const router = express.Router();
const { chatRateLimit, askQuestion, getChatHistory, clearChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(protect);

router.post('/', chatRateLimit, askQuestion);
router.get('/:documentId', getChatHistory);
router.delete('/:documentId', clearChatHistory);

module.exports = router;
