import React, { Suspense, lazy } from 'react';
const HeavyChart = lazy(() => import('../components/HeavyChart'));

export default function Projects({ tasks }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '1rem' }}>Project Dashboard</h2>
      <p>Here you can view charts and statistics for all your projects.</p>
      {tasks && (
        <Suspense fallback={<p>Loading chart...</p>}>
          <HeavyChart tasks={tasks} />
        </Suspense>
      )}
    </div>
  );
}
