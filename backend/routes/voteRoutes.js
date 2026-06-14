const express = require('express');
const { body } = require('express-validator');
const { voteComment, voteGame } = require('../controllers/voteController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
    '/comments',
    authMiddleware,
    [
        body('commentId').isInt(),
        body('voteType').isIn([1, -1]),
    ],
    validate,
    voteComment
);

router.post(
    '/games',
    authMiddleware,
    [
        body('gameId').isInt(),
        body('voteType').isIn([1, -1]),
    ],
    validate,
    voteGame
);

module.exports = router;