import React from 'react';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

export default function Dashboard({
  tasks,
  loading,
  error,
  handleCreated,
  handleUpdated,
  handleDeleted
}) {
  return (
    <>
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
    </>
  );
}
