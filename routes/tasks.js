const express = require('express');
const Task = require('../models/Task');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Every task route requires authentication, and every query is scoped
// to the authenticated user — a user can never see or touch another
// user's tasks.
router.use(requireAuth);

// GET /api/tasks?status=todo&priority=high — list my tasks
router.get('/', async (req, res) => {
  try {
    const filter = { owner: req.userId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: 'Could not load tasks' });
  }
});

// POST /api/tasks — create a task
router.post('/', async (req, res) => {
  try {
    const { title, notes, status, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const task = await Task.create({
      owner: req.userId,
      title,
      notes,
      status,
      priority,
      dueDate: dueDate || null,
    });
    res.status(201).json({ task });
  } catch (err) {
    res.status(400).json({ error: 'Could not create task' });
  }
});

// PATCH /api/tasks/:id — update my task
router.patch('/:id', async (req, res) => {
  try {
    const allowed = ['title', 'notes', 'status', 'priority', 'dueDate'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  } catch (err) {
    res.status(400).json({ error: 'Could not update task' });
  }
});

// DELETE /api/tasks/:id — delete my task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Could not delete task' });
  }
});

module.exports = router;
