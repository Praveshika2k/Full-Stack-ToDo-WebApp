import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './src/routes/auth.js';
import todoRoutes from './src/routes/todos.js';

const app = express();

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));
