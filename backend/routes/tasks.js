const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// All routes protected
router.use(auth);

// Create task
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title required'),
    body('priority').isIn(['Low', 'Medium', 'High']).optional(),
    body('status').isIn(['Pending', 'Completed']).optional()
  ],
  taskController.createTask
);

// Get tasks (paginated) - only tasks assigned to the logged-in user
router.get('/', taskController.getTasks);

// Get task by id (only if assigned to user)
router.get('/:id', taskController.getTaskById);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
