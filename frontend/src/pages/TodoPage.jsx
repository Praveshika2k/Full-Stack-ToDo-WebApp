import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import api from '../lib/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CATS = ['Personal','Work','Study','Other'];
const STATUS = ['All','Pending','Completed'];
const COLORS = ['#10b981','#3b82f6','#f59e0b','#ef4444']; // pie

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');

  // filters
  const [q, setQ] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('createdAt:desc');

  const fetchTodos = async () => {
    setLoading(true);
    const { data } = await api.get('/todos', { params: { q, category: catFilter, status, sort } });
    setTodos(data);
    setLoading(false);
  };

  useEffect(() => { fetchTodos(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { fetchTodos(); /* filters update */ }, [q, catFilter, status, sort]);

  const addTodo = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = { text, category, dueDate: dueDate || null };
    const { data } = await api.post('/todos', payload);
    setTodos(prev => [data, ...prev]);
    setText(''); setCategory('Personal'); setDueDate('');
  };

  const saveEdit = async id => {
    const { data } = await api.patch(`/todos/${id}`, { text: editedText });
    setTodos(prev => prev.map(t => t._id === id ? data : t));
    setEditingId(null);
  };

  const toggleComplete = async id => {
    const curr = todos.find(t => t._id === id);
    const { data } = await api.patch(`/todos/${id}`, { completed: !curr.completed });
    setTodos(prev => prev.map(t => t._id === id ? data : t));
  };

  const removeTodo = async id => {
    await api.delete(`/todos/${id}`);
    setTodos(prev => prev.filter(t => t._id !== id));
  };

  const pieData = useMemo(() => ([
    { name: 'Completed', value: todos.filter(t => t.completed).length },
    { name: 'Pending',   value: todos.filter(t => !t.completed).length }
  ]), [todos]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input className="px-3 py-2 rounded-xl border" placeholder="Search..."
               value={q} onChange={e=>setQ(e.target.value)} />
        <select className="px-3 py-2 rounded-xl border" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          <option>All</option>{CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="px-3 py-2 rounded-xl border" value={status} onChange={e=>setStatus(e.target.value)}>
          {STATUS.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="px-3 py-2 rounded-xl border" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="dueDate:asc">Due date ↑</option>
          <option value="dueDate:desc">Due date ↓</option>
        </select>
      </div>

      {/* Add bar */}
      <form onSubmit={addTodo} className="bg-white/80 dark:bg-white/10 backdrop-blur border border-white/30 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row gap-3">
        <input className="flex-1 px-3 py-3 rounded-xl border" placeholder="What needs to be done?"
               value={text} onChange={e=>setText(e.target.value)} />
        <select className="px-3 py-3 rounded-xl border" value={category} onChange={e=>setCategory(e.target.value)}>
          {CATS.map(c=> <option key={c}>{c}</option>)}
        </select>
        <input type="date" className="px-3 py-3 rounded-xl border" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <button className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow">Add</button>
      </form>

      {/* Analytics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur border border-white/30 rounded-2xl p-4 shadow-xl">
          <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">Completion</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i] || '#64748b'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur border border-white/30 rounded-2xl p-4 shadow-xl">
          <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">Stats</h3>
          <ul className="text-slate-700 dark:text-slate-200 space-y-1">
            <li>Total: {todos.length}</li>
            <li>Completed: {pieData[0].value}</li>
            <li>Pending: {pieData[1].value}</li>
          </ul>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <AnimatePresence>
            {todos.map(todo => (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                className="flex items-center justify-between p-4 bg-white/80 dark:bg-white/10 backdrop-blur border border-white/30 rounded-2xl shadow"
              >
                {editingId === todo._id ? (
                  <>
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border"
                      value={editedText}
                      onChange={e=>setEditedText(e.target.value)}
                    />
                    <div className="flex gap-2 ml-3">
                      <button onClick={()=>saveEdit(todo._id)} className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"><FaCheck/></button>
                      <button onClick={()=>setEditingId(null)} className="p-2 rounded-xl bg-gray-400 hover:bg-gray-500 text-white"><FaTimes/></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div
                        onClick={()=>toggleComplete(todo._id)}
                        className={`cursor-pointer font-medium ${todo.completed ? 'line-through text-slate-400 italic' : 'text-slate-800 dark:text-slate-100'}`}
                      >
                        {todo.text}
                      </div>
                      <div className="text-xs mt-1 text-slate-600 dark:text-slate-300 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{backgroundColor:
                            todo.category==='Personal' ? '#10b981' :
                            todo.category==='Work' ? '#3b82f6' :
                            todo.category==='Study' ? '#f59e0b' : '#ef4444'
                          }} />
                          {todo.category}
                        </span>
                        {todo.dueDate && (
                          <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 ml-3 text-slate-700 dark:text-slate-200">
                      <button onClick={()=>{setEditingId(todo._id); setEditedText(todo.text);}} className="hover:text-blue-600"><FaEdit/></button>
                      <button onClick={()=>removeTodo(todo._id)} className="hover:text-red-600"><FaTrash/></button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Floating Add button (focuses input) */}
      <button
        onClick={()=>document.getElementById('quick-input')?.focus()}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl bg-emerald-500 hover:bg-emerald-600 text-white"
        aria-label="Add task"
        title="Add task"
      >
        <FaPlus />
      </button>
    </div>
  );
}
