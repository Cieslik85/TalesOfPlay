const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, getUserReviews, updateProfile } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/:username', getUserProfile);
router.get('/:username/reviews', getUserReviews);

router.put(
    '/me',
    authMiddleware,
    [
        body('bio').optional().isString().isLength({ max: 500 }),
        body('avatarUrl').optional().isURL(),
    ],
    validate,
    updateProfile
);

module.exports = router;