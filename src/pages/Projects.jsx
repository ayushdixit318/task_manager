import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, Lock, Globe } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', visibility: 'Private' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', visibility: 'Private' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Projects</h1>
          <p className="text-muted">Manage your team projects and workspaces.</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Create Project
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id}>
            <div className="glass-card p-6" style={{ transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div className="flex justify-between items-start mb-4">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{project.name}</h3>
                <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {project.visibility === 'Private' ? <Lock size={12} /> : <Globe size={12} />}
                  {project.visibility}
                </span>
              </div>
              <p className="text-muted mb-6" style={{ fontSize: '0.875rem', minHeight: '40px' }}>
                {project.description || 'No description provided.'}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Users size={16} />
                {project.members.length} Members
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-card p-6 animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreateProject} className="flex-col gap-4">
              <div>
                <label className="label">Project Name</label>
                <input type="text" className="input-field" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field" rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="label">Visibility</label>
                <select className="input-field" value={newProject.visibility} onChange={e => setNewProject({...newProject, visibility: e.target.value})}>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
