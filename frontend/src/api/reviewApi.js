import axiosClient from './axiosClient';

export const createOrUpdateReview = (data) => axiosClient.post('/reviews', data);
export const getGameReviews = (gameId, params) => axiosClient.get(`/reviews/game/${gameId}`, { params });
export const deleteReview = (id) => axiosClient.delete(`/reviews/${id}`);