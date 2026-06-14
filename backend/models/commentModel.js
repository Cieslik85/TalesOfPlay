const pool = require('../config/db');

const CommentModel = {
    async create({ userId, gameId, parentId, content }) {
        const result = await pool.query(
            `INSERT INTO comments (user_id, game_id, parent_id, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, gameId, parentId || null, content]
        );
        return result.rows[0];
    },

    async getByGame(gameId, limit, offset, currentUserId) {
        const result = await pool.query(
            `SELECT c.*, u.username, u.avatar_url,
        COALESCE(SUM(CASE WHEN cv.vote_type = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN cv.vote_type = -1 THEN 1 ELSE 0 END), 0) AS downvotes,
        MAX(CASE WHEN cv.user_id = $4 THEN cv.vote_type ELSE NULL END) AS user_vote
       FROM comments c
       JOIN users u ON u.id = c.user_id
       LEFT JOIN comment_votes cv ON cv.comment_id = c.id
       WHERE c.game_id = $1
       GROUP BY c.id, u.username, u.avatar_url
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
            [gameId, limit, offset, currentUserId || null]
        );
        return result.rows;
    },

    async countByGame(gameId) {
        const result = await pool.query('SELECT COUNT(*) FROM comments WHERE game_id = $1', [gameId]);
        return parseInt(result.rows[0].count, 10);
    },

    async findById(id) {
        const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
        return result.rows[0];
    },

    async delete(id, userId) {
        const result = await pool.query(
            'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        return result.rows[0];
    },

    async update(id, userId, content) {
        const result = await pool.query(
            `UPDATE comments SET content = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3 RETURNING *`,
            [content, id, userId]
        );
        return result.rows[0];
    },
};

module.exports = CommentModel;