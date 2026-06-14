const CommentModel = require('../models/commentModel');

const createComment = async (req, res, next) => {
    try {
        const { gameId, content, parentId } = req.body;
        const userId = req.user.id;

        const comment = await CommentModel.create({
            userId,
            gameId: Number(gameId),
            parentId: parentId ? Number(parentId) : null,
            content,
        });

        res.status(201).json({ comment });
    } catch (err) {
        next(err);
    }
};

const getGameComments = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const userId = req.user ? req.user.id : null;

        const [comments, total] = await Promise.all([
            CommentModel.getByGame(gameId, Number(limit), offset, userId),
            CommentModel.countByGame(gameId),
        ]);

        const formatted = comments.map((c) => ({
            ...c,
            upvotes: Number(c.upvotes),
            downvotes: Number(c.downvotes),
            user_vote: c.user_vote !== null ? Number(c.user_vote) : null,
        }));

        res.json({
            comments: formatted,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        next(err);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const updated = await CommentModel.update(id, userId, content);
        if (!updated) {
            return res.status(404).json({ message: 'Comment not found or not authorized' });
        }

        res.json({ comment: updated });
    } catch (err) {
        next(err);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await CommentModel.delete(id, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Comment not found or not authorized' });
        }

        res.json({ message: 'Comment deleted', comment: deleted });
    } catch (err) {
        next(err);
    }
};

module.exports = { createComment, getGameComments, updateComment, deleteComment };