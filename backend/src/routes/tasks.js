const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware);

router.get('/', getTasks);

router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 255 }),
    body('due_date').optional({ values: 'null' }).isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
);

router.put('/:id',
  [
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('status').optional().isIn(['complete', 'incomplete']),
    body('due_date').optional({ values: 'null' }).isISO8601(),
  ],
  validate,
  updateTask
);

router.delete('/:id', deleteTask);

module.exports = router;
