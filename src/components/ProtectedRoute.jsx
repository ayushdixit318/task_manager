import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white'}}>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="page-container animate-fade-in">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default ProtectedRoute;
