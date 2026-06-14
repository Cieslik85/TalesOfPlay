const VoteModel = require('../models/voteModel');

// Comment votes
const voteComment = async (req, res, next) => {
    try {
        const { commentId, voteType } = req.body;
        const userId = req.user.id;

        const existing = await VoteModel.getCommentVote(userId, commentId);

        if (existing && existing.vote_type === Number(voteType)) {
            // toggle off - remove vote
            await VoteModel.removeCommentVote(userId, commentId);
            return res.json({ message: 'Vote removed', userVote: null });
        }

        const vote = await VoteModel.upsertCommentVote({
            userId,
            commentId: Number(commentId),
            voteType: Number(voteType),
        });

        res.json({ message: 'Vote recorded', userVote: vote.vote_type });
    } catch (err) {
        next(err);
    }
};

// Game votes (recommend / not recommend)
const voteGame = async (req, res, next) => {
    try {
        const { gameId, voteType } = req.body;
        const userId = req.user.id;

        const existing = await VoteModel.getGameVoteSummary(gameId, userId);

        if (existing.user_vote !== null && Number(existing.user_vote) === Number(voteType)) {
            await VoteModel.removeGameVote(userId, gameId);
            const summary = await VoteModel.getGameVoteSummary(gameId, userId);
            return res.json({
                message: 'Vote removed',
                votes: {
                    recommend: Number(summary.recommend_count),
                    notRecommend: Number(summary.not_recommend_count),
                    userVote: null,
                },
            });
        }

        await VoteModel.upsertGameVote({
            userId,
            gameId: Number(gameId),
            voteType: Number(voteType),
        });

        const summary = await VoteModel.getGameVoteSummary(gameId, userId);

        res.json({
            message: 'Vote recorded',
            votes: {
                recommend: Number(summary.recommend_count),
                notRecommend: Number(summary.not_recommend_count),
                userVote: Number(voteType),
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { voteComment, voteGame };