import { Link } from 'react-router-dom';
import { getImageSrc } from '../utils/imageUtils';
import { formatDuration } from '../utils/formatDuration';

const classificationColors = {
  'Todo público': 'bg-green-100 text-green-800',
  '+14': 'bg-yellow-100 text-yellow-800',
  'R': 'bg-red-100 text-red-800',
};

const MovieCard = ({ movie }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
    {movie.imageUrl ? (
      <img src={getImageSrc(movie.imageUrl)} alt={movie.title} className="w-full h-48 object-cover" />
    ) : (
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
        🎬
      </div>
    )}
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h5 className="font-bold text-gray-900 text-base leading-tight">{movie.title}</h5>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${classificationColors[movie.classification] ?? 'bg-gray-100 text-gray-700'}`}>
          {movie.classification}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-1">{movie.genre} · {formatDuration(movie.durationMinutes)}</p>
      <p className="text-sm text-gray-600 line-clamp-3 flex-1 mb-4">{movie.synopsis}</p>
      <Link
        to={`/peliculas/${movie.id}`}
        className="block text-center bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded transition-colors"
      >
        Ver Funciones
      </Link>
    </div>
  </div>
);

export default MovieCard;
