import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const getShowtimes = () =>
  axios.get(`${API}/showtimes`);

export const getShowtimesByMovie = (movieId) =>
  axios.get(`${API}/showtimes/movie/${movieId}`);

export const getShowtime = (id) =>
  axios.get(`${API}/showtimes/${id}`);

export const createShowtime = (data) =>
  axios.post(`${API}/showtimes`, data, { headers: authHeaders() });

export const updateShowtime = (id, data) =>
  axios.patch(`${API}/showtimes/${id}`, data, { headers: authHeaders() });

export const deleteShowtime = (id) =>
  axios.delete(`${API}/showtimes/${id}`, { headers: authHeaders() });
