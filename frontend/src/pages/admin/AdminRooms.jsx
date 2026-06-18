import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../../services/roomService';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

const emptyForm = { name: '', quantityRow: '', quantityColumn: '' };

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data);
    } catch {
      setFetchError('Error al cargar salas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await fetchRooms(); })();
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setModalOpen(true); };
  const openEdit = (room) => {
    setEditing(room);
    setForm({ name: room.name ?? '', quantityRow: room.quantityRow, quantityColumn: room.quantityColumn });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      quantityRow: Number(form.quantityRow),
      quantityColumn: Number(form.quantityColumn),
    };
    if (form.name) payload.name = form.name;
    try {
      if (editing) {
        await updateRoom(editing.id, payload);
      } else {
        await createRoom(payload);
      }
      setModalOpen(false);
      fetchRooms();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta sala?')) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) return <p className="text-gray-400 py-8">Cargando...</p>;
  if (fetchError) return <p className="text-red-500 py-8">{fetchError}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Salas</h2>
        <button
          onClick={openCreate}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + Nueva Sala
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Filas</th>
              <th className="px-4 py-3 text-left">Columnas</th>
              <th className="px-4 py-3 text-left">Capacidad</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.name ?? `Sala #${r.id}`}</td>
                <td className="px-4 py-3 text-gray-600">{r.quantityRow}</td>
                <td className="px-4 py-3 text-gray-600">{r.quantityColumn}</td>
                <td className="px-4 py-3 text-gray-600">{r.quantityRow * r.quantityColumn}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 font-medium mr-3">Editar</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Sin salas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Sala' : 'Nueva Sala'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (opcional)</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Ej: Sala 1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filas</label>
              <input name="quantityRow" type="number" min="1" value={form.quantityRow} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Columnas</label>
              <input name="quantityColumn" type="number" min="1" value={form.quantityColumn} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
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

export default AdminRooms;
