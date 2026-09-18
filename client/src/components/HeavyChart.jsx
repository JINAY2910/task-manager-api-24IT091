import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function HeavyChart({ tasks }) {
  // Aggregate tasks for the chart
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const data = [
    { name: 'Completed', count: completed, fill: '#4ade80' },
    { name: 'Pending', count: pending, fill: '#f87171' }
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Task Status Overview</h3>
      <div style={{ height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
