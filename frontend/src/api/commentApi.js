import axiosClient from './axiosClient';

export const createComment = (data) => axiosClient.post('/comments', data);
export const getGameComments = (gameId, params) => axiosClient.get(`/comments/game/${gameId}`, { params });
export const updateComment = (id, data) => axiosClient.put(`/comments/${id}`, data);
export const deleteComment = (id) => axiosClient.delete(`/comments/${id}`);