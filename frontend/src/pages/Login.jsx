/**
 * Login Page - User authentication
 */
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', workspaceName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = isRegister
      ? await register(form.name, form.email, form.password, form.workspaceName)
      : await login(form.email, form.password);

    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const result = await login('demo@aicity.com', 'demo123456');
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🏙️</div>
          <h1>AI City</h1>
          <p>{isRegister ? 'Create your workspace' : 'Welcome back'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="workspaceName">Workspace Name</label>
                <input
                  type="text"
                  id="workspaceName"
                  name="workspaceName"
                  value={form.workspaceName}
                  onChange={handleChange}
                  placeholder="My Company"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create Workspace' : 'Sign In')}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button className="demo-btn" onClick={handleDemoLogin} disabled={loading}>
          Try Demo Account
        </button>

        <div className="login-switch">
          {isRegister ? (
            <p>Already have an account? <Link to="/login" onClick={() => { setIsRegister(false); setError(''); }}>Sign in</Link></p>
          ) : (
            <p>New to AI City? <Link to="/register" onClick={() => { setIsRegister(true); setError(''); }}>Create workspace</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}
