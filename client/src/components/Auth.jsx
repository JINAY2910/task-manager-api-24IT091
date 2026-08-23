import { useState } from 'react';
import { loginUser, registerUser } from '../api';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({ email, password });
        localStorage.setItem('token', data.token);
        onLogin(data.token);
      } else {
        await registerUser({ email, password });
        // Automatically login after register
        const data = await loginUser({ email, password });
        localStorage.setItem('token', data.token);
        onLogin(data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2 className="section-heading">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="error" style={{ marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="task-input"
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="task-input"
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="auth-toggle-btn"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
