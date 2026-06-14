import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, gameId, onReplyAdded, onDelete }) => {
    if (!comments || comments.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 text-center py-6">No comments yet. Start the discussion!</p>;
    }

    return (
        <div className="space-y-3">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    gameId={gameId}
                    onReplyAdded={onReplyAdded}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default CommentList;