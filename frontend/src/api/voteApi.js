import axiosClient from './axiosClient';

export const voteComment = (data) => axiosClient.post('/votes/comments', data);
export const voteGame = (data) => axiosClient.post('/votes/games', data);