import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: 'var(--glass-border)',
      height: '100vh',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      color: 'var(--text-primary)'
    }}>
      <div className="flex items-center gap-2 mb-8" style={{ color: 'var(--accent-primary)' }}>
        <CheckSquare size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>TaskFlow</h2>
      </div>

      <div className="user-profile mb-8 glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Shield size={12} /> {user?.role}
          </div>
        </div>
      </div>

      <nav className="flex-col gap-2" style={{ flex: 1 }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isActive('/') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          color: isActive('/') ? 'var(--accent-primary)' : 'var(--text-secondary)',
          transition: 'all 0.2s'
        }}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/projects" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isActive('/projects') ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          color: isActive('/projects') ? 'var(--accent-primary)' : 'var(--text-secondary)',
          transition: 'all 0.2s'
        }}>
          <FolderKanban size={20} />
          Projects
        </Link>
      </nav>

      <button onClick={logout} className="btn btn-outline" style={{ width: '100%', border: 'none', justifyContent: 'flex-start', color: 'var(--danger)' }}>
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
