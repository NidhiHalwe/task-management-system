import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const badgeClass = (type) => {
  if (type === 'High') return 'badge badge-high';
  if (type === 'Medium') return 'badge badge-medium';
  return 'badge badge-low';
};

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  return (
    <div className="task-card card">
      <div className="task-row">
        <div className="task-left">
          <button className={`status-circle ${task.status === 'Completed' ? 'done' : ''}`} onClick={() => onToggleStatus(task)} title={task.status === 'Completed' ? 'Completed' : 'Mark complete'}>
            {task.status === 'Completed' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
        <div className="task-main">
          <Link to={`/tasks/${task._id}`} className={`task-title ${task.status === 'Completed' ? 'completed' : ''}`}>
            {task.title}
          </Link>
          <div className="task-desc">{task.description || '—'}</div>

          <div className="task-meta">
            <span className={badgeClass(task.priority)}>{task.priority}</span>
            <span className={`badge ${task.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>{task.status}</span>
            <span className="due">{task.dueDate ? format(new Date(task.dueDate), 'PP') : ''}</span>
          </div>
        </div>
        <div className="task-right">
          <div className="assigned">{task.assignedTo?.name || 'Assigned'}</div>
          <div className="actions">
            <button onClick={() => onEdit(task)}>Edit</button>
            <button className="danger" onClick={() => onDelete(task)}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
