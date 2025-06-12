import axios from 'axios';
  // const dotenv = require('dotenv');
  // dotenv.config();
  const REACT_APP_API_BASE_URL = import.meta.env.API_BASE_URL

const apiClient = axios.create({
  baseURL: REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;