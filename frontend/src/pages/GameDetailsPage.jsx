import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaCalendar, FaGlobe, FaWindows, FaPlaystation, FaXbox, FaApple, FaLinux, FaAndroid } from 'react-icons/fa';
import * as gameApi from '../api/gameApi';
import * as reviewApi from '../api/reviewApi';
import * as commentApi from '../api/commentApi';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RecommendButtons from '../components/games/RecommendButtons';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
import Pagination from '../components/common/Pagination';

const platformIcons = {
    pc: FaWindows,
    playstation: FaPlaystation,
    xbox: FaXbox,
    mac: FaApple,
    linux: FaLinux,
    ios: FaApple,
    android: FaAndroid,
};

const getPlatformIcon = (slug) => {
    const key = Object.keys(platformIcons).find((k) => slug.includes(k));
    const Icon = key ? platformIcons[key] : FaGlobe;
    return Icon;
};

const GameDetailsPage = () => {
    const { id } = useParams();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reviews, setReviews] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewTotalPages, setReviewTotalPages] = useState(1);
    const [avgRating, setAvgRating] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(1);
    const [commentTotalPages, setCommentTotalPages] = useState(1);

    const fetchGame = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await gameApi.getGameById(id);
            setGameData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load game details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await reviewApi.getGameReviews(id, { page: reviewPage, limit: 5 });
            setReviews(res.data.reviews);
            setReviewTotalPages(res.data.totalPages);
            setAvgRating(res.data.averageRating);
        } catch (err) {
            console.error(err);
        }
    }, [id, reviewPage]);

    const fetchComments = useCallback(async () => {
        try {
            const res = await commentApi.getGameComments(id, { page: commentPage, limit: 10 });
            setComments(res.data.comments);
            setCommentTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    }, [id, commentPage]);

    useEffect(() => {
        fetchGame();
    }, [fetchGame]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    if (loading) return <Spinner fullScreen />;
    if (error) return <ErrorMessage message={error} onRetry={fetchGame} />;
    if (!gameData) return null;

    const { game, screenshots, votes } = gameData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-6">
                {game.background_image ? (
                    <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-dark-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{game.name}</h1>
                    <div className="flex items-center gap-4 text-white/90 text-sm flex-wrap">
                        {game.released && (
                            <span className="flex items-center gap-1"><FaCalendar /> {new Date(game.released).toLocaleDateString()}</span>
                        )}
                        {game.rating > 0 && (
                            <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> RAWG: {game.rating}/5</span>
                        )}
                        {avgRating && (
                            <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> Community: {avgRating}/5</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">About</h2>
                        <div
                            className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: game.description || 'No description available.' }}
                        />
                    </div>

                    {/* Screenshots */}
                    {screenshots && screenshots.length > 0 && (
                        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Screenshots</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {screenshots.slice(0, 6).map((s) => (
                                    <img key={s.id} src={s.image} alt="Screenshot" className="rounded-lg w-full h-32 object-cover" loading="lazy" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Reviews</h2>
                        <ReviewForm
                            gameId={game.id}
                            existingReview={gameData.userReview}
                            onSubmitSuccess={() => {
                                fetchReviews();
                                fetchGame();
                            }}
                        />
                        <ReviewList reviews={reviews} />
                        <Pagination page={reviewPage} totalPages={reviewTotalPages} onPageChange={setReviewPage} />
                    </div>

                    {/* Comments */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Discussion</h2>
                        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4">
                            <CommentForm
                                gameId={game.id}
                                onCommentAdded={(newComment) => setComments((prev) => [{ ...newComment, upvotes: 0, downvotes: 0, user_vote: null, username: 'You' }, ...prev])}
                            />
                        </div>
                        <CommentList
                            comments={comments}
                            gameId={game.id}
                            onReplyAdded={() => fetchComments()}
                            onDelete={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
                        />
                        <Pagination page={commentPage} totalPages={commentTotalPages} onPageChange={setCommentPage} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <RecommendButtons gameId={game.id} initialVotes={votes} />

                    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3">Game Info</h3>
                        <dl className="space-y-2 text-sm">
                            {game.released && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Released</dt>
                                    <dd className="text-gray-800 dark:text-white font-medium">{new Date(game.released).toLocaleDateString()}</dd>
                                </div>
                            )}
                            {game.metacritic && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Metacritic</dt>
                                    <dd className="text-gray-800 dark:text-white font-medium">{game.metacritic}</dd>
                                </div>
                            )}
                            {game.developers && game.developers.length > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Developer</dt>
                                    <dd className="text-gray-800 dark:text-white font-medium text-right">{game.developers.map((d) => d.name).join(', ')}</dd>
                                </div>
                            )}
                            {game.publishers && game.publishers.length > 0 && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Publisher</dt>
                                    <dd className="text-gray-800 dark:text-white font-medium text-right">{game.publishers.map((p) => p.name).join(', ')}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {game.platforms && game.platforms.length > 0 && (
                        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Platforms</h3>
                            <div className="flex flex-wrap gap-3">
                                {game.platforms.map(({ platform }) => {
                                    const Icon = getPlatformIcon(platform.slug);
                                    return (
                                        <div key={platform.id} className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm bg-gray-100 dark:bg-dark-900 px-3 py-1.5 rounded-lg">
                                            <Icon /> {platform.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {game.genres && game.genres.length > 0 && (
                        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {game.genres.map((genre) => (
                                    <Link
                                        key={genre.id}
                                        to={`/games?genres=${genre.slug}`}
                                        className="text-sm bg-primary-50 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full hover:bg-primary-100"
                                    >
                                        {genre.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {game.website && (
                        <a
                            href={game.website}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-center bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700"
                        >
                            Official Website
                        </a>
                    )}
                </div>
            </div>
        </div >
    );
};

export default GameDetailsPage;