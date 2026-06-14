const UserModel = require('../models/userModel');

const getUserProfile = async (req, res, next) => {
    try {
        const { username } = req.params;

        const user = await UserModel.findByUsername(username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const stats = await UserModel.getUserStats(user.id);

        res.json({
            user: {
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url,
                bio: user.bio,
                created_at: user.created_at,
            },
            stats: {
                reviewCount: Number(stats.review_count),
                commentCount: Number(stats.comment_count),
                recommendCount: Number(stats.recommend_count),
            },
        });
    } catch (err) {
        next(err);
    }
};

const getUserReviews = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const user = await UserModel.findByUsername(username);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const reviews = await UserModel.getUserReviews(user.id, Number(limit), offset);
        res.json({ reviews });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { bio, avatarUrl } = req.body;
        const userId = req.user.id;

        const updated = await UserModel.update(userId, { bio, avatarUrl });
        res.json({ user: updated });
    } catch (err) {
        next(err);
    }
};

module.exports = { getUserProfile, getUserReviews, updateProfile };