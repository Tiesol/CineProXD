import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { removeToken } from '../utils/tokenUtils';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-red-500 tracking-wide">
          CineProXD
        </Link>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link to="/peliculas" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Cartelera
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link to="/peliculas" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Cartelera
              </Link>
              <Link to="/mis-reservas" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Mis Reservas
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
