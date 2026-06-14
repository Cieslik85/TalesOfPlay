import React, { useState } from 'react';
import StarRating from '../common/StarRating';
import useAuth from '../../hooks/useAuth';
import * as reviewApi from '../../api/reviewApi';

const ReviewForm = ({ gameId, existingReview, onSubmitSuccess }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        return (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                    Please <a href="/login" className="text-primary-600 font-medium">login</a> to write a review.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            const res = await reviewApi.createOrUpdateReview({ gameId, rating, reviewText });
            onSubmitSuccess(res.data.review);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                {existingReview ? 'Update Your Review' : 'Write a Review'}
            </h3>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                <StarRating rating={rating} onRate={setRating} interactive size="text-2xl" />
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review (optional)</label>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    maxLength={5000}
                    placeholder="Share your thoughts about this game..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-60"
            >
                {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;