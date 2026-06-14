import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaStar, FaComment, FaThumbsUp, FaCalendar, FaEdit } from 'react-icons/fa';
import * as userApi from '../api/userApi';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StarRating from '../components/common/StarRating';
import Pagination from '../components/common/Pagination';

const ProfilePage = () => {
    const { username } = useParams();
    const { user: currentUser, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [saving, setSaving] = useState(false);

    const isOwnProfile = currentUser && currentUser.username === username;

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await userApi.getUserProfile(username);
            setProfile(res.data);
            setBio(res.data.user.bio || '');
            setAvatarUrl(res.data.user.avatar_url || '');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [username]);

    const fetchReviews = useCallback(async () => {
        try {
            const res = await userApi.getUserReviews(username, { page, limit: 5 });
            setReviews(res.data.reviews);
        } catch (err) {
            console.error(err);
        }
    }, [username, page]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await userApi.updateProfile({ bio, avatarUrl });
            updateUser({ ...currentUser, bio: res.data.user.bio, avatar_url: res.data.user.avatar_url });
            setProfile((prev) => ({ ...prev, user: res.data.user }));
            setEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner fullScreen />;
    if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />;
    if (!profile) return null;

    const { user, stats } = profile;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                        <FaUserCircle className="text-7xl text-gray-300 dark:text-gray-600" />
                    )}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.username}</h1>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline"
                                >
                                    <FaEdit /> {editing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
                            <FaCalendar /> Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </p>

                        {editing ? (
                            <div className="mt-3 space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                                    <input
                                        type="text"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={3}
                                        maxLength={500}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        ) : (
                            user.bio && <p className="text-gray-600 dark:text-gray-300 mt-2">{user.bio}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-800 dark:text-white">
                            <FaStar className="text-yellow-400 text-lg" /> {stats.reviewCount}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-800 dark:text-white">
                            <FaComment className="text-blue-400 text-lg" /> {stats.commentCount}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-800 dark:text-white">
                            <FaThumbsUp className="text-green-500 text-lg" /> {stats.recommendCount}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recommendations</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Reviews</h2>
            {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet.</p>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review) => (
                        <a
                            key={review.id}
                            href={`/games/${review.game_id}`}
                            className="block bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-800 dark:text-white">Game #{review.game_id}</span>
                                <StarRating rating={review.rating} size="text-sm" />
                            </div>
                            {review.review_text && <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{review.review_text}</p>}
                        </a>
                    ))}
                </div>
            )}

            <Pagination page={page} totalPages={Math.ceil(reviews.length / 5) || 1} onPageChange={setPage} />
        </div >
    );
};

export default ProfilePage;