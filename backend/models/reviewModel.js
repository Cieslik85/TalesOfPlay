const pool = require('../config/db');

const ReviewModel = {
    async upsert({ userId, gameId, rating, reviewText }) {
        const result = await pool.query(
            `INSERT INTO reviews (user_id, game_id, rating, review_text)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, game_id)
       DO UPDATE SET rating = $3, review_text = $4, updated_at = NOW()
       RETURNING *`,
            [userId, gameId, rating, reviewText]
        );
        return result.rows[0];
    },

    async getByGame(gameId, limit, offset) {
        const result = await pool.query(
            `SELECT r.*, u.username, u.avatar_url
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.game_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
            [gameId, limit, offset]
        );
        return result.rows;
    },

    async countByGame(gameId) {
        const result = await pool.query('SELECT COUNT(*) FROM reviews WHERE game_id = $1', [gameId]);
        return parseInt(result.rows[0].count, 10);
    },

    async getAverageRating(gameId) {
        const result = await pool.query(
            `SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating, COUNT(*) AS total
       FROM reviews WHERE game_id = $1`,
            [gameId]
        );
        return result.rows[0];
    },

    async getUserReviewForGame(userId, gameId) {
        const result = await pool.query(
            'SELECT * FROM reviews WHERE user_id = $1 AND game_id = $2',
            [userId, gameId]
        );
        return result.rows[0];
    },

    async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        return result.rows[0];
    },
};

module.exports = ReviewModel;