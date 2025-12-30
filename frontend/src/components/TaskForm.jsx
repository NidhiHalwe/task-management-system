import React, { useState, useEffect, useRef } from 'react';

export default function TaskForm({ initial = {}, users = [], onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [dueDate, setDueDate] = useState(initial.dueDate ? initial.dueDate.slice(0,10) : '');
  const [priority, setPriority] = useState(initial.priority || 'Medium');
  const [assignedTo, setAssignedTo] = useState(initial.assignedTo?._id || '');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const priorityRef = useRef();
  const [assignOpen, setAssignOpen] = useState(false);
  const assignRef = useRef();
  const dateRef = useRef();

  const openDatePicker = () => {
    if (!dateRef.current) return;
    // Preferred modern API
    if (typeof dateRef.current.showPicker === 'function') {
      try { dateRef.current.showPicker(); return; } catch (e) { /* ignore */ }
    }
    // Fallback: focus the input
    dateRef.current.focus();
  };

  useEffect(() => {
    if (users.length && !assignedTo) setAssignedTo(users[0]._id);
  }, [users]);

  useEffect(() => {
    function onDoc(e) {
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  useEffect(() => {
    function onDoc2(e) {
      if (assignRef.current && !assignRef.current.contains(e.target)) {
        setAssignOpen(false);
      }
    }
    document.addEventListener('click', onDoc2);
    return () => document.removeEventListener('click', onDoc2);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate, priority, assignedTo });
  };

  return (
    <form className="task-form modal-form" onSubmit={submit}>
      <h2 className="modal-title">{initial._id ? 'Edit Task' : 'Create New Task'}</h2>
      <p className="modal-sub">Add a new task to your list. Fill in the details below.</p>

      <label>Title *</label>
      <input className="input-primary" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Description</label>
      <textarea className="input-primary large" placeholder="Enter task description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="row two">
        <div>
          <label>Due Date</label>
          <div className="date-field">
            <input ref={dateRef} className="input-primary date-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <div className="date-icon" aria-hidden onClick={openDatePicker} role="button" tabIndex={0}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11h5v5H7z" fill="#9fb1c9" />
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM5 8h14v10H5V8z" fill="#9fb1c9" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label>Priority</label>
          <div className="priority-select" ref={priorityRef}>
            <button type="button" className="priority-selected input-primary" onClick={() => setPriorityOpen((s) => !s)}>
              <span className={`dot ${priority.toLowerCase()}`} /> {priority}
              <span className="caret">▾</span>
            </button>
            {priorityOpen && (
              <div className="priority-options card">
                {['Low','Medium','High'].map((p) => (
                  <div key={p} className="priority-option" onClick={() => { setPriority(p); setPriorityOpen(false); }}>
                    <span className={`dot ${p.toLowerCase()}`} /> {p}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <label>Assign To</label>
      <div className="assign-select" ref={assignRef}>
        <button type="button" className="assign-selected input-primary" onClick={() => setAssignOpen((s) => !s)}>
          <span className="assigned-label">{users.find((u) => u._id === assignedTo)?.name || 'Select user'}</span>
          <span className="caret">▾</span>
        </button>
        {assignOpen && (
          <div className="assign-options card">
            <div className="priority-option" onClick={() => { setAssignedTo(''); setAssignOpen(false); }}>
              Unassigned
            </div>
            {users.map((u) => (
              <div key={u._id} className="assign-option" onClick={() => { setAssignedTo(u._id); setAssignOpen(false); }}>
                {u.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="muted" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary">{initial._id ? 'Update Task' : 'Create Task'}</button>
      </div>
    </form>
  );
}
