import { useState, useEffect } from 'react';
import { getMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchMovies = async (genreFilter, titleFilter) => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await getMovies(genreFilter || undefined, titleFilter || undefined);
      setMovies(res.data);
    } catch {
      setFetchError('Error al cargar películas. Verificá tu conexión.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies().then((res) => {
      setAllGenres([...new Set(res.data.map((m) => m.genre))].sort());
    }).catch(() => {});
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(genre, search);
  };

  const handleGenreChange = (e) => {
    const val = e.target.value;
    setGenre(val);
    fetchMovies(val, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cartelera</h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Buscar por título..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={genre}
          onChange={handleGenreChange}
          className="w-44 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
        >
          <option value="">Todos los géneros</option>
          {allGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
        >
          Buscar
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-400 py-16">Cargando películas...</p>
      ) : fetchError ? (
        <p className="text-center text-red-500 py-16">{fetchError}</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No se encontraron películas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
