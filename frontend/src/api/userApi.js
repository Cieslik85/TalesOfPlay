import axiosClient from './axiosClient';

export const getUserProfile = (username) => axiosClient.get(`/users/${username}`);
export const getUserReviews = (username, params) => axiosClient.get(`/users/${username}/reviews`, { params });
export const updateProfile = (data) => axiosClient.put('/users/me', data);