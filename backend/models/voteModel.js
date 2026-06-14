const pool = require('../config/db');

const VoteModel = {
    // Comment votes
    async upsertCommentVote({ userId, commentId, voteType }) {
        const result = await pool.query(
            `INSERT INTO comment_votes (user_id, comment_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, comment_id)
       DO UPDATE SET vote_type =
         CASE WHEN comment_votes.vote_type = $3 THEN comment_votes.vote_type ELSE $3 END
       RETURNING *`,
            [userId, commentId, voteType]
        );
        return result.rows[0];
    },

    async removeCommentVote(userId, commentId) {
        const result = await pool.query(
            'DELETE FROM comment_votes WHERE user_id = $1 AND comment_id = $2 RETURNING *',
            [userId, commentId]
        );
        return result.rows[0];
    },

    async getCommentVote(userId, commentId) {
        const result = await pool.query(
            'SELECT * FROM comment_votes WHERE user_id = $1 AND comment_id = $2',
            [userId, commentId]
        );
        return result.rows[0];
    },

    // Game votes (recommend / not recommend)
    async upsertGameVote({ userId, gameId, voteType }) {
        const result = await pool.query(
            `INSERT INTO game_votes (user_id, game_id, vote_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, game_id)
       DO UPDATE SET vote_type = $3, created_at = NOW()
       RETURNING *`,
            [userId, gameId, voteType]
        );
        return result.rows[0];
    },

    async removeGameVote(userId, gameId) {
        const result = await pool.query(
            'DELETE FROM game_votes WHERE user_id = $1 AND game_id = $2 RETURNING *',
            [userId, gameId]
        );
        return result.rows[0];
    },

    async getGameVoteSummary(gameId, userId) {
        const result = await pool.query(
            `SELECT
        COALESCE(SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END), 0) AS recommend_count,
        COALESCE(SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END), 0) AS not_recommend_count,
        MAX(CASE WHEN user_id = $2 THEN vote_type ELSE NULL END) AS user_vote
       FROM game_votes WHERE game_id = $1`,
            [gameId, userId || null]
        );
        return result.rows[0];
    },

    async getTopRankedGames(limit) {
        const result = await pool.query(
            `SELECT game_id,
        COALESCE(SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END), 0) AS recommend_count,
        COALESCE(SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END), 0) AS not_recommend_count,
        (COALESCE(SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END), 0) -
         COALESCE(SUM(CASE WHEN vote_type = -1 THEN 1 ELSE 0 END), 0)) AS score
       FROM game_votes
       GROUP BY game_id
       ORDER BY score DESC
       LIMIT $1`,
            [limit]
        );
        return result.rows;
    },
};

module.exports = VoteModel;