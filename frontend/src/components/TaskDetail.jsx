import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasks as tasksAPI } from '../services/api';
import { format } from 'date-fns';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    fetch();
  }, [id]);

  const fetch = async () => {
    try {
      const res = await tasksAPI.get(id);
      setTask(res.data);
    } catch (err) {
      console.error(err);
      nav('/');
    }
  };

  if (!task) return <div className="center">Loading...</div>;

  return (
    <div className="task-detail card">
      <h2>{task.title}</h2>
      <div className="meta">Priority: {task.priority} | Status: {task.status}</div>
      <div>Assigned to: {task.assignedTo?.name}</div>
      <div>Due: {task.dueDate ? format(new Date(task.dueDate), 'PP') : '—'}</div>
      <p>{task.description}</p>
      <button onClick={() => nav(-1)}>Back</button>
    </div>
  );
}
