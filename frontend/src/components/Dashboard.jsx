import React, { useEffect, useState, useRef } from 'react';
import { tasks as tasksAPI, auth as authAPI } from '../services/api';
import { removeToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Toast from './Toast';
import socket from '../services/socket';
import Header from './Header';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (payload) => {
    // clear existing
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    setToast(payload);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  const nav = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUser();
    socket.connect();
    socket.on('taskCreated', ({ task }) => setTasks((prev) => [task, ...prev]));
    socket.on('taskUpdated', ({ task }) => setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t))));
    socket.on('taskDeleted', ({ id }) => setTasks((prev) => prev.filter((t) => t._id !== id)));
    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
      socket.disconnect();
    };
  }, []);

  const fetchUser = async () => {
    try {
      const me = await authAPI.me();
      setUser(me.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        removeToken();
        nav('/login');
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.list(1, 100);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        removeToken();
        nav('/login');
      }
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    high: tasks.filter((t) => t.priority === 'High').length
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await tasksAPI.update(editing._id, data);
        showToast({ title: 'Task updated', body: 'Your task has been updated successfully.' });
      } else {
        await tasksAPI.create(data);
        showToast({ title: 'Task created', body: 'Your task has been created successfully.' });
      }
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksAPI.remove(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      showToast({ title: 'Task deleted', body: 'Task removed successfully.' });
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const onToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      await tasksAPI.update(task._id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
      showToast({ title: 'Task updated', body: 'Your task status was updated.' });
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    removeToken();
    nav('/login');
  };

  return (
    <div className="dashboard-full">
      <Header user={user} />

      <main className="container">
        <div className="stats-row">
          <div className="stat card">
            <div className="stat-left">Total Tasks</div>
            <div className="stat-right">{stats.total}</div>
          </div>
          <div className="stat card">
            <div className="stat-left">Completed</div>
            <div className="stat-right">{stats.completed}</div>
          </div>
          <div className="stat card">
            <div className="stat-left">Pending</div>
            <div className="stat-right">{stats.pending}</div>
          </div>
          <div className="stat card">
            <div className="stat-left">High Priority</div>
            <div className="stat-right">{stats.high}</div>
          </div>
        </div>

        <div className="controls">
          <div className="filters">
            <label>Filters:</label>
            <div className="priority-legend">
              <span className="dot low" title="Low" /> Low
              <span style={{width:12}} />
              <span className="dot medium" title="Medium" /> Medium
              <span style={{width:12}} />
              <span className="dot high" title="High" /> High
            </div>
            <select>
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select>
              <option>All Status</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <button className="primary big" onClick={openCreate}>+ Add Task</button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Get started by creating your first task. Click the button above to add one.</p>
            <button className="primary" onClick={openCreate}>+ Create Your First Task</button>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((t) => (
              <TaskCard key={t._id} task={t} onEdit={(task) => { setEditing(task); setShowForm(true); }} onDelete={handleDelete} onToggleStatus={onToggleStatus} />
            ))}
          </div>
        )}

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <TaskForm initial={editing || {}} users={user ? [user] : []} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        )}
        <Toast message={toast} onClose={() => setToast(null)} />
      </main>
    </div>
  );
}

