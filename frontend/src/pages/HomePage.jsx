import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaSearch, FaArrowRight } from 'react-icons/fa';
import * as gameApi from '../api/gameApi';
import GameGrid from '../components/games/GameGrid';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';

const HomePage = () => {
    const [popularGames, setPopularGames] = useState([]);
    const [topRanked, setTopRanked] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [gamesRes, rankedRes] = await Promise.all([
                gameApi.getGames({ pageSize: 8, ordering: '-added' }),
                gameApi.getTopRanked(4),
            ]);
            setPopularGames(gamesRes.data.results);
            setTopRanked(rankedRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Discover, Rate & Review Games</h1>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        Join our community of gamers. Browse thousands of titles, share your reviews, and find your next favorite game.
                    </p>
                    <Link
                        to="/games"
                        className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors"
                    >
                        <FaSearch /> Browse Games
                    </Link>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && <ErrorMessage message={error} onRetry={fetchData} />}

                {loading ? (
                    <Spinner fullScreen />
                ) : (
                    <>
                        {topRanked.length > 0 && (
                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <FaTrophy className="text-yellow-500" /> Top Community Picks
                                    </h2>
                                    <Link to="/rankings" className="text-primary-600 font-medium flex items-center gap-1 hover:underline">
                                        View Rankings <FaArrowRight />
                                    </Link>
                                </div>
                                <GameGrid games={topRanked.map((t) => t.game)} />
                            </section>
                        )}

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Trending Games</h2>
                                <Link to="/games" className="text-primary-600 font-medium flex items-center gap-1 hover:underline">
                                    View All <FaArrowRight />
                                </Link>
                            </div>
                            <GameGrid games={popularGames} />
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default HomePage;