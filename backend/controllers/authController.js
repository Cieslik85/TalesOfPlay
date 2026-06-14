const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../services/tokenService');

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingEmail = await UserModel.findByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const existingUsername = await UserModel.findByUsername(username);
        if (existingUsername) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await UserModel.create({ username, email, passwordHash });
        const token = generateToken({ id: user.id, username: user.username });

        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken({ id: user.id, username: user.username });

        const { password_hash, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword, token });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, getMe };