import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. Token may be invalid or expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in text-center" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        
        {status === 'loading' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Verifying your email...</h2>
            <p className="text-muted">Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="flex justify-center mb-4" style={{ color: 'var(--success)' }}>
              <CheckCircle size={48} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Email Verified!</h2>
            <p className="text-muted mb-6">{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="flex justify-center mb-4" style={{ color: 'var(--danger)' }}>
              <XCircle size={48} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Verification Failed</h2>
            <p className="text-muted mb-6">{message}</p>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;
