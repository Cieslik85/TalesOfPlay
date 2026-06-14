import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import * as voteApi from '../../api/voteApi';

const RecommendButtons = ({ gameId, initialVotes }) => {
    const { user } = useAuth();
    const [votes, setVotes] = useState(initialVotes);
    const [loading, setLoading] = useState(false);

    const handleVote = async (voteType) => {
        if (!user) {
            alert('Please login to vote');
            return;
        }
        setLoading(true);
        try {
            const res = await voteApi.voteGame({ gameId, voteType });
            setVotes(res.data.votes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const total = votes.recommend + votes.notRecommend;
    const percentage = total > 0 ? Math.round((votes.recommend / total) * 100) : 0;

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Community Recommendation</h3>
            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={() => handleVote(1)}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${votes.userVote === 1
                            ? 'bg-green-600 text-white'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100'
                        }`}
                >
                    <FaThumbsUp /> Recommend ({votes.recommend})
                </button>
                <button
                    onClick={() => handleVote(-1)}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${votes.userVote === -1
                            ? 'bg-red-600 text-white'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100'
                        }`}
                >
                    <FaThumbsDown /> Not Recommend ({votes.notRecommend})
                </button>
            </div>
            {total > 0 && (
                <div>
                    <div className="w-full bg-gray-200 dark:bg-dark-900 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{percentage}% of {total} users recommend this game</p>
                </div>
            )}
        </div>
    );
};

export default RecommendButtons;