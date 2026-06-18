import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const login = (email, password) =>
  axios.post(`${API}/auth/login`, { email, password });

export const register = (name, lastname, email, password) =>
  axios.post(`${API}/auth/register`, { name, lastname, email, password });
