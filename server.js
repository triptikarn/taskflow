require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Frontend (vanilla HTML/CSS/JS in ./public)
app.use(express.static(path.join(__dirname, 'public')));

// JSON error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('Missing MONGO_URI or JWT_SECRET — copy .env.example to .env and fill it in.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`TaskFlow running at http://localhost:${PORT}`));
}

if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
}

module.exports = app;
