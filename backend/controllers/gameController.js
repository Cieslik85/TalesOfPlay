const RawgService = require('../services/rawgService');
const VoteModel = require('../models/voteModel');
const ReviewModel = require('../models/reviewModel');

const getGames = async (req, res, next) => {
    try {
        const { page = 1, pageSize = 20, search, genres, platforms, year, ordering } = req.query;

        let dates;
        if (year) {
            dates = `${year}-01-01,${year}-12-31`;
        }

        const data = await RawgService.getGames({
            page: Number(page),
            pageSize: Number(pageSize),
            search,
            genres,
            platforms,
            dates,
            ordering,
        });

        res.json({
            count: data.count,
            next: data.next,
            previous: data.previous,
            results: data.results,
        });
    } catch (err) {
        next(err);
    }
};

const getGameById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;

        const [details, screenshots, ratingSummary, voteSummary] = await Promise.all([
            RawgService.getGameDetails(id),
            RawgService.getGameScreenshots(id),
            ReviewModel.getAverageRating(id),
            VoteModel.getGameVoteSummary(id, userId),
        ]);

        let userReview = null;
        if (userId) {
            userReview = await ReviewModel.getUserReviewForGame(userId, id);
        }

        res.json({
            game: details,
            screenshots: screenshots.results || [],
            communityRating: {
                average: ratingSummary.avg_rating ? Number(ratingSummary.avg_rating) : null,
                totalReviews: Number(ratingSummary.total),
            },
            votes: {
                recommend: Number(voteSummary.recommend_count),
                notRecommend: Number(voteSummary.not_recommend_count),
                userVote: voteSummary.user_vote !== null ? Number(voteSummary.user_vote) : null,
            },
            userReview,
        });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return res.status(404).json({ message: 'Game not found' });
        }
        next(err);
    }
};

const getGenres = async (req, res, next) => {
    try {
        const data = await RawgService.getGenres();
        res.json(data.results);
    } catch (err) {
        next(err);
    }
};

const getPlatforms = async (req, res, next) => {
    try {
        const data = await RawgService.getPlatforms();
        res.json(data.results);
    } catch (err) {
        next(err);
    }
};

const getTopRanked = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const topGames = await VoteModel.getTopRankedGames(Number(limit));

        const enriched = await Promise.all(
            topGames.map(async (g) => {
                try {
                    const details = await RawgService.getGameDetails(g.game_id);
                    return {
                        ...g,
                        recommend_count: Number(g.recommend_count),
                        not_recommend_count: Number(g.not_recommend_count),
                        score: Number(g.score),
                        game: {
                            id: details.id,
                            name: details.name,
                            background_image: details.background_image,
                            released: details.released,
                            rating: details.rating,
                        },
                    };
                } catch {
                    return null;
                }
            })
        );

        res.json(enriched.filter(Boolean));
    } catch (err) {
        next(err);
    }
};

module.exports = { getGames, getGameById, getGenres, getPlatforms, getTopRanked };