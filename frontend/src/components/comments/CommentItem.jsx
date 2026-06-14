import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaArrowUp, FaArrowDown, FaReply, FaTrash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import * as voteApi from '../../api/voteApi';
import * as commentApi from '../../api/commentApi';
import CommentForm from './CommentForm';

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const CommentItem = ({ comment, gameId, onReplyAdded, onDelete }) => {
    const { user } = useAuth();
    const [upvotes, setUpvotes] = useState(comment.upvotes);
    const [downvotes, setDownvotes] = useState(comment.downvotes);
    const [userVote, setUserVote] = useState(comment.user_vote);
    const [showReply, setShowReply] = useState(false);

    const handleVote = async (voteType) => {
        if (!user) {
            alert('Please login to vote');
            return;
        }
        try {
            const res = await voteApi.voteComment({ commentId: comment.id, voteType });
            const newVote = res.data.userVote;

            // recompute counts locally
            let newUp = upvotes;
            let newDown = downvotes;

            if (userVote === 1) newUp -= 1;
            if (userVote === -1) newDown -= 1;
            if (newVote === 1) newUp += 1;
            if (newVote === -1) newDown += 1;

            setUpvotes(newUp);
            setDownvotes(newDown);
            setUserVote(newVote);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await commentApi.deleteComment(comment.id);
            onDelete(comment.id);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
                <Link to={`/profile/${comment.username}`} className="flex items-center gap-2 font-medium text-gray-800 dark:text-white hover:text-primary-600">
                    {comment.avatar_url ? (
                        <img src={comment.avatar_url} alt={comment.username} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                        <FaUserCircle className="text-xl text-gray-400" />
                    )}
                    {comment.username}
                </Link>
                <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{comment.content}</p>

            <div className="flex items-center gap-4 text-sm">
                <button
                    onClick={() => handleVote(1)}
                    className={`flex items-center gap-1 ${userVote === 1 ? 'text-green-600 font-semibold' : 'text-gray-500 hover:text-green-600'}`}
                >
                    <FaArrowUp /> {upvotes}
                </button>
                <button
                    onClick={() => handleVote(-1)}
                    className={`flex items-center gap-1 ${userVote === -1 ? 'text-red-600 font-semibold' : 'text-gray-500 hover:text-red-600'}`}
                >
                    <FaArrowDown /> {downvotes}
                </button>
                <button
                    onClick={() => setShowReply(!showReply)}
                    className="flex items-center gap-1 text-gray-500 hover:text-primary-600"
                >
                    <FaReply /> Reply
                </button>
                {user && user.id === comment.user_id && (
                    <button onClick={handleDelete} className="flex items-center gap-1 text-gray-500 hover:text-red-600 ml-auto">
                        <FaTrash /> Delete
                    </button>
                )}
            </div>

            {showReply && (
                <div className="mt-3 ml-4">
                    <CommentForm
                        gameId={gameId}
                        parentId={comment.id}
                        onCommentAdded={(newComment) => {
                            onReplyAdded(newComment);
                            setShowReply(false);
                        }}
                        onCancel={() => setShowReply(false)}
                        placeholder={`Reply to ${comment.username}...`}
                    />
                </div>
            )}
        </div>
    );
};

export default CommentItem;