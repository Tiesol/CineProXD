import { useState, useEffect } from 'react';
import { getShowtimes, createShowtime, updateShowtime, deleteShowtime } from '../../services/showtimeService';
import { getMovies } from '../../services/movieService';
import { getRooms } from '../../services/roomService';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

const emptyForm = { movieId: '', roomId: '', startTime: '', endTime: '', price: '' };

const toLocalDatetimeValue = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

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

  useEffect(() => {
    (async () => { await fetchAll(); })();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, movieId: movies[0]?.id ?? '', roomId: rooms[0]?.id ?? '' });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (st) => {
    setEditing(st);
    setForm({
      movieId: st.movie?.id ?? '',
      roomId: st.room?.id ?? '',
      startTime: toLocalDatetimeValue(st.startTime),
      endTime: toLocalDatetimeValue(st.endTime),
      price: st.price,
    });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      movieId: Number(form.movieId),
      roomId: Number(form.roomId),
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      price: Number(form.price),
    };
    try {
      if (editing) {
        await updateShowtime(editing.id, payload);
      } else {
        await createShowtime(payload);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Funciones</h2>
        <button
          onClick={openCreate}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
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
                <td className="px-4 py-3 text-gray-600">{new Date(st.startTime).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(st.endTime).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-4 py-3 text-gray-600">${Number(st.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(st)} className="text-blue-600 hover:text-blue-800 font-medium mr-3">Editar</button>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Función' : 'Nueva Función'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Película</label>
            <select name="movieId" value={form.movieId} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Seleccionar...</option>
              {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
              <input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
              <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <Alert message={error} type="warning" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminShowtimes;
