const express = require('express');
const { body } = require('express-validator');
const {
    createOrUpdateReview,
    getGameReviews,
    deleteReview,
} = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
    '/',
    authMiddleware,
    [
        body('gameId').isInt().withMessage('gameId must be an integer'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
        body('reviewText').optional().isString().isLength({ max: 5000 }),
    ],
    validate,
    createOrUpdateReview
);

router.get('/game/:gameId', getGameReviews);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;