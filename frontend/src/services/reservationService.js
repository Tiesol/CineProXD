import axios from 'axios';
import { getToken } from '../utils/tokenUtils';

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const createReservation = (showtimeId, seats) =>
  axios.post(`${API}/reservations`, { showtimeId, seats }, { headers: authHeaders() });

export const getMyReservations = () =>
  axios.get(`${API}/reservations/my`, { headers: authHeaders() });

export const getSeatMap = (showtimeId) =>
  axios.get(`${API}/reservations/seat-map/${showtimeId}`);
