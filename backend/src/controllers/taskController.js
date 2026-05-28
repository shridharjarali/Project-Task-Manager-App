const { pool } = require('../config/db');

/**
 * Verify that the project belongs to the authenticated user.
 */
async function verifyProjectOwnership(projectId, userId) {
  const result = await pool.query(
    'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId]
  );
  return result.rows.length > 0;
}

/**
 * GET /api/projects/:projectId/tasks
 * Fetch all tasks for a given project.
 */
async function getTasks(req, res) {
  try {
    const { projectId } = req.params;

    const hasAccess = await verifyProjectOwnership(projectId, req.user.id);
    if (!hasAccess) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
}

/**
 * POST /api/projects/:projectId/tasks
 * Create a new task inside a project.
 */
async function createTask(req, res) {
  try {
    const { projectId } = req.params;
    const { title, due_date } = req.body;

    const hasAccess = await verifyProjectOwnership(projectId, req.user.id);
    if (!hasAccess) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (project_id, title, due_date) VALUES ($1, $2, $3) RETURNING *',
      [projectId, title, due_date || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
}

/**
 * PUT /api/projects/:projectId/tasks/:id
 * Update a task (title, status, due_date).
 */
async function updateTask(req, res) {
  try {
    const { projectId, id } = req.params;
    const { title, status, due_date } = req.body;

    const hasAccess = await verifyProjectOwnership(projectId, req.user.id);
    if (!hasAccess) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const result = await pool.query(
      `UPDATE tasks SET 
        title = COALESCE($1, title),
        status = COALESCE($2, status),
        due_date = COALESCE($3, due_date),
        updated_at = NOW()
       WHERE id = $4 AND project_id = $5
       RETURNING *`,
      [title, status, due_date, id, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
}

/**
 * DELETE /api/projects/:projectId/tasks/:id
 * Delete a task.
 */
async function deleteTask(req, res) {
  try {
    const { projectId, id } = req.params;

    const hasAccess = await verifyProjectOwnership(projectId, req.user.id);
    if (!hasAccess) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND project_id = $2 RETURNING id',
      [id, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
