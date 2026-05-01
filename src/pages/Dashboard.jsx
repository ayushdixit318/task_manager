import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-card p-6 flex flex-col justify-between" style={{ minHeight: '140px' }}>
    <div className="flex justify-between items-center mb-4">
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>{title}</h3>
      <div className={colorClass} style={{ padding: '0.5rem', borderRadius: '50%' }}>
        <Icon size={24} />
      </div>
    </div>
    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
      {value}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/tasks/dashboard/summary');
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch summary', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-muted">Here is what's happening with your tasks today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <DashboardCard 
          title="Total Tasks" 
          value={summary.totalTasks} 
          icon={ListTodo} 
          colorClass="status-todo"
        />
        <DashboardCard 
          title="Completed" 
          value={summary.completedTasks} 
          icon={CheckCircle} 
          colorClass="status-done"
        />
        <DashboardCard 
          title="In Progress" 
          value={summary.pendingTasks} 
          icon={Clock} 
          colorClass="status-inprogress"
        />
        <DashboardCard 
          title="Overdue" 
          value={summary.overdueTasks} 
          icon={AlertCircle} 
          colorClass="status-todo" // Will add custom overdue class if needed, or use warning
          style={{ color: 'var(--danger)' }}
        />
      </div>

      <div className="mt-8 glass-card p-6">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h2>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          Activity feed visualization will appear here
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
