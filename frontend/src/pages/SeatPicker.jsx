import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getShowtime } from '../services/showtimeService';
import { getSeatMap, createReservation } from '../services/reservationService';
import SeatMap from '../components/SeatMap';
import Alert from '../components/Alert';
import { useAuth } from '../hooks/useAuth';

const SeatPicker = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [reserved, setReserved] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, mapRes] = await Promise.all([
          getShowtime(showtimeId),
          isLoggedIn ? getSeatMap(showtimeId) : Promise.resolve({ data: [] }),
        ]);
        setShowtime(stRes.data);
        setReserved(mapRes.data);
      } catch {
        navigate('/peliculas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showtimeId, isLoggedIn, navigate]);

  const handleToggle = (rowNum, colNum) => {
    if (!isLoggedIn) return;
    setSelected((prev) => {
      const exists = prev.some((s) => s.rowNum === rowNum && s.colNum === colNum);
      return exists
        ? prev.filter((s) => !(s.rowNum === rowNum && s.colNum === colNum))
        : [...prev, { rowNum, colNum }];
    });
  };

  const handleConfirm = async () => {
    if (selected.length === 0) { setError('Seleccioná al menos un asiento.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await createReservation(Number(showtimeId), selected);
      navigate('/mis-reservas');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al reservar';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-400">Cargando...</p>;
  if (!showtime) return null;

  const rows = showtime.room?.quantityRow ?? 0;
  const cols = showtime.room?.quantityColumn ?? 0;
  const totalPrice = selected.length * Number(showtime.price);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition-colors"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">{showtime.movie?.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(showtime.startTime).toLocaleString('es-AR', {
              weekday: 'long', day: 'numeric', month: 'long',
              hour: '2-digit', minute: '2-digit',
            })}
            {' · '}Sala: {showtime.room?.name ?? `#${showtime.room?.id}`}
            {' · '}$<span className="font-semibold text-red-600">{Number(showtime.price).toFixed(2)}</span> por asiento
          </p>
        </div>

        <div className="px-6 py-6 border-b border-gray-100">
          <SeatMap
            rows={rows}
            cols={cols}
            reserved={reserved}
            selected={selected}
            onToggle={handleToggle}
          />
        </div>

        <div className="px-6 py-4">
          {isLoggedIn ? (
            <>
              <Alert message={error} type="warning" />
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Seleccionados: <span className="font-semibold text-gray-800">{selected.length}</span></p>
                  <p className="text-lg font-bold text-gray-900">Total: <span className="text-red-600">${totalPrice.toFixed(2)}</span></p>
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={submitting || selected.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded transition-colors"
                >
                  {submitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Iniciá sesión para reservar asientos.</p>
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded text-sm transition-colors"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;
