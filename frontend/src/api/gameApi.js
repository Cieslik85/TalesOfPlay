import axiosClient from './axiosClient';

export const getGames = (params) => axiosClient.get('/games', { params });
export const getGameById = (id) => axiosClient.get(`/games/${id}`);
export const getGenres = () => axiosClient.get('/games/genres');
export const getPlatforms = () => axiosClient.get('/games/platforms');
export const getTopRanked = (limit = 10) => axiosClient.get('/games/top-ranked', { params: { limit } });