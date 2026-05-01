import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/');
      } else {
        const data = await register(formData.name, formData.email, formData.password, formData.role);
        setSuccessMsg(data.message);
        if (data.emailPreviewUrl) setPreviewUrl(data.emailPreviewUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Authentication failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        
        <div className="flex items-center justify-center gap-2 mb-6" style={{ color: 'var(--accent-primary)' }}>
          <CheckSquare size={40} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>TaskFlow</h1>
        </div>
        
        <h2 className="text-center mb-6" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>

        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        {successMsg && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {successMsg}
            {previewUrl && (
              <div className="mt-2">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>
                  Click here to view the simulated email
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
          )}
          
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          
          <div>
            <label className="label">Password</label>
            <input type="password" className="input-field" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength="6" />
          </div>

          {!isLogin && (
            <div>
              <label className="label">Role</label>
              <select className="input-field" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-muted text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
