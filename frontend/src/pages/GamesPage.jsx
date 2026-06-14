import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as gameApi from '../api/gameApi';
import GameGrid from '../components/games/GameGrid';
import GameFilters from '../components/games/GameFilters';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 20;

const GamesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [games, setGames] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        genres: searchParams.get('genres') || '',
        platforms: searchParams.get('platforms') || '',
        year: searchParams.get('year') || '',
        ordering: searchParams.get('ordering') || '',
    });

    const debouncedFilters = useDebounce(filters, 400);

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [genresRes, platformsRes] = await Promise.all([
                    gameApi.getGenres(),
                    gameApi.getPlatforms(),
                ]);
                setGenres(genresRes.data);
                setPlatforms(platformsRes.data.slice(0, 20));
            } catch (err) {
                console.error(err);
            }
        };
        fetchMeta();
    }, []);

    const fetchGames = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page,
                pageSize: PAGE_SIZE,
                ...debouncedFilters,
            };
            // remove empty params
            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const res = await gameApi.getGames(params);
            setGames(res.data.results);
            setCount(res.data.count);

            // sync to URL
            setSearchParams(params, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load games');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, debouncedFilters]);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    useEffect(() => {
        setPage(1);
    }, [debouncedFilters]);

    const totalPages = Math.min(Math.ceil(count / PAGE_SIZE), 500);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Browse Games</h1>

            <div className="mb-6">
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    placeholder="Search games by name..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-dark-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
                />
            </div>

            <GameFilters filters={filters} setFilters={setFilters} genres={genres} platforms={platforms} />

            {error ? (
                <ErrorMessage message={error} onRetry={fetchGames} />
            ) : loading ? (
                <Spinner fullScreen />
            ) : (
                <>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{count.toLocaleString()} games found</p>
                    <GameGrid games={games} />
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
};

export default GamesPage;