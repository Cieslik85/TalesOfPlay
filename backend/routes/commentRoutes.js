const express = require('express');
const { body } = require('express-validator');
const {
    createComment,
    getGameComments,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    [
        body('gameId').isInt().withMessage('gameId must be an integer'),
        body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Content required (max 2000 chars)'),
        body('parentId').optional().isInt(),
    ],
    validate,
    createComment
);

router.get('/game/:gameId', optionalAuth, getGameComments);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;