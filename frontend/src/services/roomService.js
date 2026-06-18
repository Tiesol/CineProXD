import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const getRooms = () =>
  axios.get(`${API}/rooms`);

export const getRoom = (id) =>
  axios.get(`${API}/rooms/${id}`);

export const createRoom = (data) =>
  axios.post(`${API}/rooms`, data, { headers: authHeaders() });

export const updateRoom = (id, data) =>
  axios.patch(`${API}/rooms/${id}`, data, { headers: authHeaders() });

export const deleteRoom = (id) =>
  axios.delete(`${API}/rooms/${id}`, { headers: authHeaders() });
