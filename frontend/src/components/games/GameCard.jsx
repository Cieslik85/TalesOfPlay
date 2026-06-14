import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const GameCard = ({ game }) => {
    return (
        <Link
            to={`/games/${game.id}`}
            className="bg-white dark:bg-dark-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
        >
            <div className="relative h-44 overflow-hidden bg-gray-200 dark:bg-dark-900">
                {game.background_image ? (
                    <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {game.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
                        <FaStar className="text-xs" />
                        {game.rating}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-800 dark:text-white line-clamp-2 mb-1">{game.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {game.released ? new Date(game.released).getFullYear() : 'TBA'}
                </p>
                <div className="flex flex-wrap gap-1">
                    {(game.genres || []).slice(0, 3).map((genre) => (
                        <span
                            key={genre.id}
                            className="text-xs bg-primary-50 dark:bg-primary-700/20 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default GameCard;