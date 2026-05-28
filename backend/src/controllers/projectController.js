const { pool } = require('../config/db');

/**
 * GET /api/projects
 * Fetch all projects for the authenticated user.
 */
async function getProjects(req, res) {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as task_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'complete') as completed_count
       FROM projects p 
       WHERE p.user_id = $1 
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
}

/**
 * POST /api/projects
 * Create a new project for the authenticated user.
 */
async function createProject(req, res) {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      'INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, title, description || null]
    );

    // Add task counts to the response
    const project = { ...result.rows[0], task_count: '0', completed_count: '0' };
    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
}

/**
 * PUT /api/projects/:id
 * Update a project's title and/or description.
 */
async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const result = await pool.query(
      `UPDATE projects SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description),
        updated_at = NOW()
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [title, description, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
}

/**
 * DELETE /api/projects/:id
 * Delete a project and all its tasks (cascade).
 */
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };
