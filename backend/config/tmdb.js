const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY || '08e475403f00932401951b7995894d17';
const TMDB_API_URL = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: TMDB_API_URL,
  params: {
    api_key: '08e475403f00932401951b7995894d17'
  }
});

module.exports = tmdbClient;