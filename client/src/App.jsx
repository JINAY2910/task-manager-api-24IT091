import { Suspense, lazy, useState, useEffect } from 'react';
import { getTasks } from './api';
import { Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';
import './App.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      handleLogout();
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
  };

  const handleCreated = (task) => setTasks((prev) => [task, ...prev]);
  const handleUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  const handleDeleted = (id) =>
    setTasks((prev) => prev.filter((t) => t._id !== id));

  const pending = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;

  if (!token) {
    return <Auth onLogin={setToken} />;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-title">
          <h1>Task <span>Manager</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
          {!loading && !error && tasks.length > 0 && (
            <div className="header-stats">
              <span className="stat-badge pending">{pending} pending</span>
              <span className="stat-badge done">{done} done</span>
            </div>
          )}
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
            Logout
          </button>
        </div>
      </div>

      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading page...</div>}>
        <Routes>
          <Route path="/" element={
            <Dashboard 
              tasks={tasks} 
              loading={loading} 
              error={error} 
              handleCreated={handleCreated} 
              handleUpdated={handleUpdated} 
              handleDeleted={handleDeleted} 
            />
          } />
          <Route path="/projects" element={<Projects tasks={tasks} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </div>
  );
}
