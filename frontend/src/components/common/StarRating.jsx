import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, onRate, interactive = false, size = 'text-xl' }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <FaStar
                    key={star}
                    className={`${size} cursor-${interactive ? 'pointer' : 'default'} transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        }`}
                    onClick={() => interactive && onRate && onRate(star)}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                />
            ))}
        </div>
    );
};

export default StarRating;