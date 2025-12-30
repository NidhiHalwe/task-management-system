const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');

// Create Task
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    // assignedTo is required; ensure exists
    const assignee = await User.findById(assignedTo);
    if (!assignee) return res.status(400).json({ msg: 'Assigned user not found' });

    const task = new Task({
      title,
      description,
      dueDate,
      priority: priority || 'Low',
      status: status || 'Pending',
      assignedTo: assignee._id,
      createdBy: req.user.id
    });

    await task.save();

    // notify via socket
    const io = req.app.get('io');
    io.emit('taskCreated', { task });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get Tasks with pagination - only tasks assigned to logged-in user
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { assignedTo: req.user.id };

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ priority: -1, dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({ page, limit, totalPages: Math.ceil(total / limit), total, tasks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get Task by id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Unauthorized' });
    if (task.assignedTo._id.toString() !== req.user.id) return res.status(403).json({ msg: 'Access denied' });
    res.json(task);
  } catch (err) {
    console.error('getTaskById error', err);
    if (err && err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.assignedTo.toString() !== req.user.id) return res.status(403).json({ msg: 'Access denied' });

    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee) return res.status(400).json({ msg: 'Assigned user not found' });
      task.assignedTo = assignee._id;
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status && status !== task.status) {
      task.status = status;
    }

    await task.save();

    // notify via socket
    const io = req.app.get('io');
    io.emit('taskUpdated', { task });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
    res.status(500).send('Server error');
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    // Safer atomic delete: only delete if the requester is the assigned user
    if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    const requesterId = String(req.user.id);
    console.log(`Delete request by user=${requesterId} for task=${req.params.id}`);

    const deleted = await Task.findOneAndDelete({ _id: req.params.id, assignedTo: requesterId });
    if (!deleted) {
      // Could be not found or not authorized
      const exists = await Task.exists({ _id: req.params.id });
      if (exists) return res.status(403).json({ msg: 'Access denied: only the assigned user can delete this task' });
      return res.status(404).json({ msg: 'Task not found' });
    }

    const io = req.app.get('io');
    io.emit('taskDeleted', { id: req.params.id });

    res.json({ msg: 'Task removed', id: req.params.id });
  } catch (err) {
    console.error('deleteTask error', err);
    if (err && err.kind === 'ObjectId') return res.status(404).json({ msg: 'Task not found' });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
