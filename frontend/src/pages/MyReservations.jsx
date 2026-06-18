import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyReservations } from '../services/reservationService';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/Alert';

const MyReservations = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    const fetchData = async () => {
      try {
        const res = await getMyReservations();
        setReservations(res.data);
      } catch {
        setError('Error al cargar reservas.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn, navigate]);

  if (loading) return <p className="text-center py-16 text-gray-400">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Reservas</h1>
      <Alert message={error} type="warning" />

      {reservations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🎟️</p>
          <p>No tenés reservas aún.</p>
          <button
            onClick={() => navigate('/peliculas')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded transition-colors"
          >
            Ver Cartelera
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {reservations.map((r) => (
            <div key={r.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{r.showtime?.movie?.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {new Date(r.showtime?.startTime).toLocaleString('es-AR', {
                    weekday: 'long', day: 'numeric', month: 'long',
                    hour: '2-digit', minute: '2-digit',
                  })}
                  {' · '}Sala: {r.showtime?.room?.name ?? `#${r.showtime?.room?.id}`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Asientos: {r.seats?.map((s) => `${String.fromCharCode(65 + s.rowNum)}${s.colNum + 1}`).join(', ')}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Reservado el {new Date(r.createdAt).toLocaleDateString('es-AR')}
                </p>
              </div>
              <p className="text-xl font-bold text-red-600 shrink-0">${Number(r.totalPrice).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
