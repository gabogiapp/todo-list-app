import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find({ userId: req.auth.sub });
  res.json(todos);
});

// Add a new todo
router.post('/', async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    userId: req.auth.sub // Auth0 user ID from JWT
  });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// Update a todo
router.put('/:id', async (req, res) => {
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.auth.sub },
    req.body,
    { new: true }
  );
  res.json(updatedTodo);
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.auth.sub });
  res.json({ message: 'Todo deleted' });
});

export default router;
