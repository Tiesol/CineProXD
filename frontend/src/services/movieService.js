import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const getMovies = (genre, title) =>
  axios.get(`${API}/movies`, { params: { genre, title } });

export const getMovie = (id) =>
  axios.get(`${API}/movies/${id}`);

export const createMovie = (data) =>
  axios.post(`${API}/movies`, data, { headers: authHeaders() });

export const uploadMovieImage = (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post(`${API}/movies/${id}/image`, formData, { headers: authHeaders() });
};

export const updateMovie = (id, data) =>
  axios.patch(`${API}/movies/${id}`, data, { headers: authHeaders() });

export const deleteMovie = (id) =>
  axios.delete(`${API}/movies/${id}`, { headers: authHeaders() });
