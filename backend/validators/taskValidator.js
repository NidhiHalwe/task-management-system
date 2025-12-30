const { body } = require('express-validator');

exports.createTaskValidation = [
  body('title').notEmpty().withMessage('Title required'),
  body('assignedTo').notEmpty().withMessage('AssignedTo user id required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('status').optional().isIn(['Pending', 'Completed'])
];
