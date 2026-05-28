const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/projects
router.get('/', getProjects);

// POST /api/projects
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Project title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description must be at most 2000 characters'),
  ],
  validate,
  createProject
);

// PUT /api/projects/:id
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 255 }),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 }),
  ],
  validate,
  updateProject
);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

module.exports = router;
