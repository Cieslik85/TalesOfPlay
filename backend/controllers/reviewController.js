const ReviewModel = require('../models/reviewModel');

const createOrUpdateReview = async (req, res, next) => {
    try {
        const { gameId, rating, reviewText } = req.body;
        const userId = req.user.id;

        const review = await ReviewModel.upsert({
            userId,
            gameId: Number(gameId),
            rating: Number(rating),
            reviewText: reviewText || null,
        });

        res.status(201).json({ review });
    } catch (err) {
        next(err);
    }
};

const getGameReviews = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const [reviews, total, avgRating] = await Promise.all([
            ReviewModel.getByGame(gameId, Number(limit), offset),
            ReviewModel.countByGame(gameId),
            ReviewModel.getAverageRating(gameId),
        ]);

        res.json({
            reviews,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            averageRating: avgRating.avg_rating ? Number(avgRating.avg_rating) : null,
        });
    } catch (err) {
        next(err);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await ReviewModel.delete(id, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Review not found or not authorized' });
        }

        res.json({ message: 'Review deleted', review: deleted });
    } catch (err) {
        next(err);
    }
};

module.exports = { createOrUpdateReview, getGameReviews, deleteReview };