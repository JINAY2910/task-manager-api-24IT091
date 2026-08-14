import { useState } from 'react';
import { updateTask, deleteTask } from '../api';

export default function TaskItem({ task, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await updateTask(task._id, {
        title, description, priority, completed: task.completed,
      });
      if (updated.error) throw new Error(updated.error);
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      if (updated.error) throw new Error(updated.error);
      onUpdated(updated);
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      await deleteTask(task._id);
      onDeleted(task._id);
    } catch (err) {
      setError(err.message || 'Failed to delete');
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <div className="task-item editing">
        <form onSubmit={handleUpdate}>
          {error && <p className="error">{error}</p>}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn-sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'done' : ''}`}>
      <div className="task-row">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={loading}
        />
        <div className="task-left">
          <p className="task-title">{task.title}</p>
        </div>
        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
        <span className={`badge ${task.priority || 'medium'}`}>
          {task.priority || 'medium'}
        </span>
        <div className="actions">
          <button className="btn-sm" onClick={() => setEditing(true)} disabled={loading}>
            Edit
          </button>
          <button className="btn-sm danger" onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
