import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import * as gameApi from '../api/gameApi';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';

const RankingsPage = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRankings = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await gameApi.getTopRanked(20);
            setRankings(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load rankings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    const medalColors = ['text-yellow-400', 'text-gray-400', 'text-amber-600'];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Community Rankings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Games ranked by community recommend votes</p>

            {error ? (
                <ErrorMessage message={error} onRetry={fetchRankings} />
            ) : loading ? (
                <Spinner fullScreen />
            ) : rankings.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">No ranked games yet. Start voting!</p>
            ) : (
                <div className="space-y-3">
                    {rankings.map((item, index) => (
                        <Link
                            key={item.game_id}
                            to={`/games/${item.game_id}`}
                            className="flex items-center gap-4 bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                            <div className={`text-2xl font-bold w-10 text-center ${medalColors[index] || 'text-gray-300 dark:text-gray-600'}`}>
                                #{index + 1}
                            </div>
                            {item.game.background_image && (
                                <img src={item.game.background_image} alt={item.game.name} className="w-20 h-16 object-cover rounded-lg" />
                            )}
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 dark:text-white">{item.game.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {item.game.rating > 0 && (
                                        <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> {item.game.rating}</span>
                                    )}
                                    <span className="flex items-center gap-1 text-green-600"><FaThumbsUp /> {item.recommend_count}</span>
                                    <span className="flex items-center gap-1 text-red-500"><FaThumbsDown /> {item.not_recommend_count}</span>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-primary-600">{item.score > 0 ? '+' : ''}{item.score}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RankingsPage;