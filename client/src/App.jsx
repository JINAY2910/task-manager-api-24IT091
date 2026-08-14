import { useState, useEffect } from 'react';
import { getTasks } from './api';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        throw new Error('Unexpected response');
      }
    } catch {
      setError('Could not connect to backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreated = (task) => setTasks((prev) => [task, ...prev]);
  const handleUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  const handleDeleted = (id) =>
    setTasks((prev) => prev.filter((t) => t._id !== id));

  const pending = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;

  return (
    <div className="container">
      <div className="header">
        <div className="header-title">
          <h1>Task <span>Manager</span></h1>
        </div>
        {!loading && !error && tasks.length > 0 && (
          <div className="header-stats">
            <span className="stat-badge pending">{pending} pending</span>
            <span className="stat-badge done">{done} done</span>
          </div>
        )}
      </div>

      <div className="card">
        <TaskForm onCreated={handleCreated} />
      </div>

      <p className="section-heading">
        All Tasks {!loading && `(${tasks.length})`}
      </p>

      <div className="task-list">
        {loading && <p className="status-msg">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="status-msg">No tasks yet. Add one above.</p>
        )}
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </div>
  );
}
