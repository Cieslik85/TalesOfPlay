import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as commentApi from '../../api/commentApi';

const CommentForm = ({ gameId, parentId = null, onCommentAdded, onCancel, placeholder = 'Add a comment...' }) => {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        return (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
                <a href="/login" className="text-primary-600 font-medium">Login</a> to join the discussion.
            </p>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            const res = await commentApi.createComment({ gameId, content: content.trim(), parentId });
            setContent('');
            onCommentAdded(res.data.comment);
            if (onCancel) onCancel();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={2}
                maxLength={2000}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="flex gap-2 mt-2">
                <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
                >
                    {submitting ? 'Posting...' : 'Post'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-1.5 bg-gray-100 dark:bg-dark-900 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default CommentForm;