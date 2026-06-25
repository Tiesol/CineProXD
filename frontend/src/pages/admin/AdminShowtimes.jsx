import { useState, useEffect } from 'react';
import { getShowtimes, createShowtime, deleteShowtime } from '../../services/showtimeService';
import { getMovies } from '../../services/movieService';
import { getRooms } from '../../services/roomService';
import { formatDuration } from '../../utils/formatDuration';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

const emptyForm = { movieId: '', roomId: '', dateFrom: '', dateTo: '', startHour: '10:00', price: '' };

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [stRes, movRes, roomRes] = await Promise.all([getShowtimes(), getMovies(), getRooms()]);
      setShowtimes(stRes.data);
      setMovies(movRes.data);
      setRooms(roomRes.data);
    } catch {
      setFetchError('Error al cargar funciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { (async () => { await fetchAll(); })(); }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, movieId: movies[0]?.id ?? '', roomId: rooms[0]?.id ?? '' });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectedMovie = movies.find((m) => m.id === Number(form.movieId));

  const previewEnd = () => {
    if (!form.startHour || !selectedMovie) return null;
    const [h, m] = form.startHour.split(':').map(Number);
    const totalMins = h * 60 + m + selectedMovie.durationMinutes;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedMovie) { setError('Seleccioná una película'); return; }
    if (!form.dateFrom || !form.dateTo) { setError('Ingresá rango de fechas'); return; }
    if (form.dateTo < form.dateFrom) { setError('Fecha fin debe ser mayor o igual a fecha inicio'); return; }

    const days = [];
    const cursor = new Date(form.dateFrom + 'T00:00:00');
    const end = new Date(form.dateTo + 'T00:00:00');
    while (cursor <= end) {
      days.push(cursor.toISOString().split('T')[0]);
      cursor.setDate(cursor.getDate() + 1);
    }

    setSubmitting(true);
    const failed = [];
    let created = 0;
    for (const day of days) {
      const startTime = new Date(`${day}T${form.startHour}:00`);
      const endTime = new Date(startTime.getTime() + selectedMovie.durationMinutes * 60 * 1000);
      try {
        await createShowtime({
          movieId: Number(form.movieId),
          roomId: Number(form.roomId),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          price: Number(form.price),
        });
        created++;
      } catch (err) {
        const raw = err.response?.data?.message || 'error';
        const msg = typeof raw === 'string' && raw.toLowerCase().includes('overlap')
          ? 'ya hay una función en esa sala a esa hora'
          : (Array.isArray(raw) ? raw.join(', ') : raw);
        failed.push(`${day}: ${msg}`);
      }
    }
    setSubmitting(false);
    if (failed.length === 0) {
      setModalOpen(false);
      fetchAll();
    } else {
      if (created > 0) fetchAll();
      setError(`${created} función(es) creada(s). Falló(aron) ${failed.length}:\n${failed.join('\n')}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta función?')) return;
    try {
      await deleteShowtime(id);
      setShowtimes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) return <p className="text-gray-400 py-8">Cargando...</p>;
  if (fetchError) return <p className="text-red-500 py-8">{fetchError}</p>;

  const endPreview = previewEnd();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Funciones</h2>
        <button onClick={openCreate} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors">
          + Nueva Función
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Película</th>
              <th className="px-4 py-3 text-left">Sala</th>
              <th className="px-4 py-3 text-left">Inicio</th>
              <th className="px-4 py-3 text-left">Fin</th>
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {showtimes.map((st) => (
              <tr key={st.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{st.movie?.title}</td>
                <td className="px-4 py-3 text-gray-600">{st.room?.name ?? `#${st.room?.id}`}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(st.startTime).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(st.endTime).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-gray-600">${Number(st.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(st.id)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {showtimes.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Sin funciones</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Función">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Película</label>
            <select name="movieId" value={form.movieId} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Seleccionar...</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title} ({formatDuration(m.durationMinutes)})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sala</label>
            <select name="roomId" value={form.roomId} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Seleccionar...</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name ?? `Sala #${r.id}`}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input name="dateFrom" type="date" value={form.dateFrom} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input name="dateTo" type="date" value={form.dateTo} min={form.dateFrom} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
            <input name="startHour" type="time" value={form.startHour} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            {endPreview && (
              <p className="text-xs text-gray-400 mt-1">
                Fin estimado: <span className="font-medium text-gray-600">{endPreview}</span> (duración: {formatDuration(selectedMovie.durationMinutes)})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {form.dateFrom && form.dateTo && form.dateFrom <= form.dateTo && (
            <p className="text-xs text-blue-600 bg-blue-50 rounded px-3 py-2">
              Se crearán <strong>{Math.floor((new Date(form.dateTo) - new Date(form.dateFrom)) / 86400000) + 1}</strong> funciones (una por día)
            </p>
          )}

          <Alert message={error} type="warning" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50">
              {submitting ? 'Creando...' : 'Crear funciones'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminShowtimes;
