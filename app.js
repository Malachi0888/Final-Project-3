require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Task Management API is running' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

module.exports = app;
