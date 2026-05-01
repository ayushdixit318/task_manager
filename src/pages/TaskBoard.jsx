import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, ArrowLeft, Calendar, UserPlus, X, Users } from 'lucide-react';

const TaskCard = ({ task, onStatusChange }) => {
  return (
    <div className="glass-card p-4 mb-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)' }}>
      <div className="flex justify-between items-start mb-2">
        <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</h4>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select 
            value={task.status} 
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            style={{ 
              appearance: 'none', background: 'transparent', border: 'none', 
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem' 
            }}
          >
            <option value="Todo" style={{color: 'black'}}>Todo</option>
            <option value="In Progress" style={{color: 'black'}}>In Progress</option>
            <option value="Done" style={{color: 'black'}}>Done</option>
          </select>
        </div>
      </div>
      <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>{task.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <span className={`badge priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  
  const [newTask, setNewTask] = useState({ 
    title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' 
  });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data);

      const taskRes = await api.get(`/tasks?projectId=${id}`);
      setTasks(taskRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch', error);
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' });
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks(); // Refresh tasks
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const openMemberModal = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
      if (res.data.length > 0) setSelectedUser(res.data[0]._id);
      setShowMemberModal(true);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { user: selectedUser, role: 'Member' });
      setShowMemberModal(false);
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to add member', error);
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Failed to remove member', error);
      alert('Failed to remove member');
    }
  };

  if (loading) return <div>Loading board...</div>;

  const todoTasks = tasks.filter(t => t.status === 'Todo');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{project?.name || 'Task Board'}</h1>
            {project?.members && (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                <Users size={14} />
                <span>Members: </span>
                <div className="flex gap-2">
                  {project.members.map(m => (
                    <span key={m.user._id} className="badge" style={{ backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {m.user.name.split(' ')[0]}
                      {user?.role === 'Admin' && (
                        <button onClick={() => handleRemoveMember(m.user._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}>
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {user?.role === 'Admin' && (
            <button className="btn btn-outline" onClick={openMemberModal}>
              <UserPlus size={20} /> Add Member
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Task
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Todo Column */}
        <div className="glass-card flex-col" style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '2px solid var(--border-color)' }}>
            <h3 style={{ fontWeight: 600 }}>Todo</h3>
            <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)' }}>{todoTasks.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {todoTasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />)}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="glass-card flex-col" style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '2px solid var(--accent-primary)' }}>
            <h3 style={{ fontWeight: 600 }}>In Progress</h3>
            <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)' }}>{inProgressTasks.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {inProgressTasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />)}
          </div>
        </div>

        {/* Done Column */}
        <div className="glass-card flex-col" style={{ padding: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
          <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '2px solid var(--success)' }}>
            <h3 style={{ fontWeight: 600 }}>Done</h3>
            <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>{doneTasks.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {doneTasks.map(task => <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />)}
          </div>
        </div>

      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-card p-6 animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Task</h2>
            <form onSubmit={handleCreateTask} className="flex-col gap-4">
              <div>
                <label className="label">Task Title</label>
                <input type="text" className="input-field" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field" rows="2" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4">
                <div style={{ flex: 1 }}>
                  <label className="label">Priority</label>
                  <select className="input-field" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Due Date</label>
                  <input type="date" className="input-field" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-card p-6 animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add Project Member</h2>
            <form onSubmit={handleAddMember} className="flex-col gap-4">
              <div>
                <label className="label">Select User</label>
                <select className="input-field" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
