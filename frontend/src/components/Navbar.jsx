import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const isAuthed = !!localStorage.getItem('token');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/30 dark:bg-black/30 border-b border-white/20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          Task Manager Pro
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(v => !v)}
            className="p-2 rounded-xl bg-white/70 dark:bg-white/10 border border-white/30 hover:scale-105 transition"
            title="Toggle theme"
          >
            {dark ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-slate-700" />}
          </button>
          {isAuthed ? (
            <>
              <Link to="/" className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">Dashboard</Link>
              <button onClick={logout} className="px-3 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
