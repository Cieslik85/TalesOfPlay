const axios = require('axios');
require('dotenv').config();

const RAWG_BASE_URL = process.env.RAWG_BASE_URL || 'https://api.rawg.io/api';
const RAWG_API_KEY = process.env.RAWG_API_KEY;

const rawgClient = axios.create({
  baseURL: RAWG_BASE_URL,
  timeout: 10000,
});

const RawgService = {
  async getGames({ page = 1, pageSize = 20, search, genres, platforms, dates, ordering }) {
    const params = {
      key: RAWG_API_KEY,
      page,
      page_size: pageSize,
    };
    if (search) params.search = search;
    if (genres) params.genres = genres;
    if (platforms) params.platforms = platforms;
    if (dates) params.dates = dates;
    if (ordering) params.ordering = ordering;

    const { data } = await rawgClient.get('/games', { params });
    return data;
  },

  async getGameDetails(id) {
    const { data } = await rawgClient.get(`/games/${id}`, {
      params: { key: RAWG_API_KEY },
    });
    return data;
  },

  async getGameScreenshots(id) {
    const { data } = await rawgClient.get(`/games/${id}/screenshots`, {
      params: { key: RAWG_API_KEY },
    });
    return data;
  },

  async getGenres() {
    const { data } = await rawgClient.get('/genres', {
      params: { key: RAWG_API_KEY },
    });
    return data;
  },

  async getPlatforms() {
    const { data } = await rawgClient.get('/platforms', {
      params: { key: RAWG_API_KEY },
    });
    return data;
  },
};

module.exports = RawgService;