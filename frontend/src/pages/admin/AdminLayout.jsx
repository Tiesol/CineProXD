import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';

const links = [
  { to: '/admin/peliculas', label: 'Películas' },
  { to: '/admin/salas', label: 'Salas' },
  { to: '/admin/funciones', label: 'Funciones' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/peliculas'); }
  }, [isLoggedIn, isAdmin, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
      <aside className="w-48 shrink-0">
        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3">Administración</h3>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
