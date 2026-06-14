const pool = require('../config/db');

const UserModel = {
    async create({ username, email, passwordHash }) {
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, avatar_url, bio, created_at`,
            [username, email, passwordHash]
        );
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    async findByUsername(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT id, username, email, avatar_url, bio, created_at FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async update(id, { bio, avatarUrl }) {
        const result = await pool.query(
            `UPDATE users SET bio = COALESCE($1, bio), avatar_url = COALESCE($2, avatar_url)
       WHERE id = $3
       RETURNING id, username, email, avatar_url, bio, created_at`,
            [bio, avatarUrl, id]
        );
        return result.rows[0];
    },

    async getUserStats(id) {
        const result = await pool.query(
            `SELECT
        (SELECT COUNT(*) FROM reviews WHERE user_id = $1) AS review_count,
        (SELECT COUNT(*) FROM comments WHERE user_id = $1) AS comment_count,
        (SELECT COUNT(*) FROM game_votes WHERE user_id = $1 AND vote_type = 1) AS recommend_count`,
            [id]
        );
        return result.rows[0];
    },

    async getUserReviews(id, limit, offset) {
        const result = await pool.query(
            `SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
            [id, limit, offset]
        );
        return result.rows;
    },
};

module.exports = UserModel;