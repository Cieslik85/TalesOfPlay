import React from 'react';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

const GameFilters = ({ filters, setFilters, genres, platforms }) => {
    const handleChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                    <select
                        value={filters.genres || ''}
                        onChange={(e) => handleChange('genres', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Genres</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.slug}>{g.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                    <select
                        value={filters.platforms || ''}
                        onChange={(e) => handleChange('platforms', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Platforms</option>
                        {platforms.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Release Year</label>
                    <select
                        value={filters.year || ''}
                        onChange={(e) => handleChange('year', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Years</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                        value={filters.ordering || ''}
                        onChange={(e) => handleChange('ordering', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Relevance</option>
                        <option value="-rating">Highest Rated</option>
                        <option value="-released">Newest</option>
                        <option value="released">Oldest</option>
                        <option value="-added">Most Popular</option>
                        <option value="name">Name (A-Z)</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default GameFilters;