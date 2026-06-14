import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating';
import { FaUserCircle } from 'react-icons/fa';

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 text-center py-6">No reviews yet. Be the first to review!</p>;
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Link to={`/profile/${review.username}`} className="flex items-center gap-2 font-medium text-gray-800 dark:text-white hover:text-primary-600">
                            {review.avatar_url ? (
                                <img src={review.avatar_url} alt={review.username} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <FaUserCircle className="text-2xl text-gray-400" />
                            )}
                            {review.username}
                        </Link>
                        <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                    </div>
                    <StarRating rating={review.rating} size="text-sm" />
                    {review.review_text && (
                        <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">{review.review_text}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;