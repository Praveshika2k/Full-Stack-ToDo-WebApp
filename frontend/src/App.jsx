

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoPage from './pages/Todopage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PrivateRoute><TodoPage /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
