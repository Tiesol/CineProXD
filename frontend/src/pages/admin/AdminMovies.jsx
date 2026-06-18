import { useState, useEffect } from 'react';
import { getMovies, createMovie, updateMovie, uploadMovieImage, deleteMovie } from '../../services/movieService';
import { getImageSrc } from '../../utils/imageUtils';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

const CLASSIFICATIONS = ['Todo público', '+14', 'R'];
const emptyForm = { title: '', durationMinutes: '', genre: '', classification: 'Todo público', synopsis: '' };

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data);
    } catch {
      setFetchError('Error al cargar películas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await fetchMovies(); })();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (movie) => {
    setEditing(movie);
    setForm({
      title: movie.title,
      durationMinutes: movie.durationMinutes,
      genre: movie.genre,
      classification: movie.classification,
      synopsis: movie.synopsis,
    });
    setImageFile(null);
    setImagePreview(getImageSrc(movie.imageUrl));
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      title: form.title,
      durationMinutes: Number(form.durationMinutes),
      genre: form.genre,
      classification: form.classification,
      synopsis: form.synopsis,
    };
    try {
      let movie;
      if (editing) {
        const res = await updateMovie(editing.id, payload);
        movie = res.data;
      } else {
        const res = await createMovie(payload);
        movie = res.data;
      }
      if (imageFile) {
        await uploadMovieImage(movie.id, imageFile);
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta película?')) return;
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) return <p className="text-gray-400 py-8">Cargando...</p>;
  if (fetchError) return <p className="text-red-500 py-8">{fetchError}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Películas</h2>
        <button
          onClick={openCreate}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          + Nueva Película
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Poster</th>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Género</th>
              <th className="px-4 py-3 text-left">Duración</th>
              <th className="px-4 py-3 text-left">Clasificación</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movies.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {m.imageUrl ? (
                    <img src={getImageSrc(m.imageUrl)} alt={m.title} className="w-10 h-14 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-lg">🎬</div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{m.title}</td>
                <td className="px-4 py-3 text-gray-600">{m.genre}</td>
                <td className="px-4 py-3 text-gray-600">{m.durationMinutes} min</td>
                <td className="px-4 py-3 text-gray-600">{m.classification}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(m)} className="text-blue-600 hover:text-blue-800 font-medium mr-3">Editar</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Sin películas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Película' : 'Nueva Película'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
              <input name="durationMinutes" type="number" min="1" value={form.durationMinutes} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <input name="genre" value={form.genre} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación</label>
            <select name="classification" value={form.classification} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
            <textarea name="synopsis" value={form.synopsis} onChange={handleChange} required rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster (imagen)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-2 h-32 object-contain rounded border border-gray-200" />
            )}
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

export default AdminMovies;
