import React from 'react';
import GameCard from './GameCard';

const GameGrid = ({ games }) => {
    if (!games || games.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-12">No games found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    );
};

export default GameGrid;