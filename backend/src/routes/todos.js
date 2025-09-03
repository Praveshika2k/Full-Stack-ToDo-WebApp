import { Router } from 'express';
import Todo from '../models/Todo.js';
import auth from '../middleware/auth.js';

const router = Router();

// List with optional filters: q, category, status, sort
router.get('/', auth, async (req, res) => {
  const { q, category, status, sort = 'createdAt:desc' } = req.query;
  const query = { user: req.user.id };
  if (q) query.text = { $regex: q, $options: 'i' };
  if (category && category !== 'All') query.category = category;
  if (status === 'Completed') query.completed = true;
  if (status === 'Pending') query.completed = false;

  const [sortField, sortDir] = sort.split(':');
  const todos = await Todo.find(query).sort({ [sortField]: sortDir === 'asc' ? 1 : -1 });
  res.json(todos);
});

router.post('/', auth, async (req, res) => {
  const { text, category = 'Personal', dueDate = null } = req.body;
  const todo = await Todo.create({ user: req.user.id, text, category, dueDate });
  res.status(201).json(todo);
});

router.patch('/:id', auth, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: 'Not found' });
  res.json(todo);
});

router.delete('/:id', auth, async (req, res) => {
  const del = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!del) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export default router;
