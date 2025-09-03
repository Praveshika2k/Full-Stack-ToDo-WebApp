import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/80 dark:bg-white/10 backdrop-blur border border-white/30 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Welcome back</h2>
        {err && <p className="mb-3 text-red-600">{err}</p>}
        <input className="w-full mb-3 p-3 rounded-xl border" placeholder="Email" type="email"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="w-full mb-4 p-3 rounded-xl border" placeholder="Password" type="password"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <button className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">Login</button>
        <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">No account? <Link to="/register" className="text-emerald-600">Register</Link></p>
      </form>
    </div>
  );
}
