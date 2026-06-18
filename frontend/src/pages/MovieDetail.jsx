import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie } from '../services/movieService';
import { getShowtimesByMovie } from '../services/showtimeService';
import { useAuth } from '../hooks/useAuth';
import { getImageSrc } from '../utils/imageUtils';

const classificationColors = {
  'Todo público': 'bg-green-100 text-green-800',
  '+14': 'bg-yellow-100 text-yellow-800',
  'R': 'bg-red-100 text-red-800',
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          getMovie(id),
          getShowtimesByMovie(id),
        ]);
        setMovie(movieRes.data);
        setShowtimes(showtimesRes.data);
      } catch {
        navigate('/peliculas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSelectShowtime = (showtimeId) => {
    navigate(`/reservar/${showtimeId}`);
  };

  if (loading) return <p className="text-center py-16 text-gray-400">Cargando...</p>;
  if (!movie) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/peliculas')}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Volver a cartelera
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {movie.imageUrl ? (
            <img src={getImageSrc(movie.imageUrl)} alt={movie.title} className="w-full md:w-64 h-64 md:h-auto object-cover shrink-0" />
          ) : (
            <div className="w-full md:w-64 h-64 bg-gray-200 flex items-center justify-center text-gray-400 text-6xl shrink-0">
              🎬
            </div>
          )}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{movie.title}</h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${classificationColors[movie.classification] ?? 'bg-gray-100 text-gray-700'}`}>
                {movie.classification}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{movie.genre} · {movie.durationMinutes} min</p>
            <p className="text-gray-700 text-sm leading-relaxed">{movie.synopsis}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Funciones disponibles</h2>
        {showtimes.length === 0 ? (
          <p className="text-gray-400">No hay funciones programadas.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {showtimes.map((st) => (
              <div key={st.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 border border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(st.startTime).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(st.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} –{' '}
                  {new Date(st.endTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-500">Sala: {st.room?.name ?? `#${st.room?.id}`}</p>
                <p className="text-lg font-bold text-red-600">${Number(st.price).toFixed(2)}</p>
                <button
                  onClick={() => handleSelectShowtime(st.id)}
                  className="mt-auto bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded transition-colors"
                >
                  Seleccionar Asientos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
