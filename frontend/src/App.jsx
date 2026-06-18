import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import SeatPicker from './pages/SeatPicker';
import MyReservations from './pages/MyReservations';
import AdminLayout from './pages/admin/AdminLayout';
import AdminMovies from './pages/admin/AdminMovies';
import AdminRooms from './pages/admin/AdminRooms';
import AdminShowtimes from './pages/admin/AdminShowtimes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/peliculas" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/peliculas" element={<MovieList />} />
          <Route path="/peliculas/:id" element={<MovieDetail />} />
          <Route path="/reservar/:showtimeId" element={<SeatPicker />} />
          <Route path="/mis-reservas" element={<MyReservations />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/peliculas" />} />
            <Route path="peliculas" element={<AdminMovies />} />
            <Route path="salas" element={<AdminRooms />} />
            <Route path="funciones" element={<AdminShowtimes />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
