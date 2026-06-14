const express = require('express');
const { getGames, getGameById, getGenres, getPlatforms, getTopRanked } = require('../controllers/gameController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getGames);
router.get('/genres', getGenres);
router.get('/platforms', getPlatforms);
router.get('/top-ranked', getTopRanked);
router.get('/:id', optionalAuth, getGameById);

module.exports = router;