const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to reject POST/PUT requests missing Content-Type header
app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method)) {
        if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
            return res.status(400).json({ error: 'Content-Type must be application/json' });
        }
    }
    next();
});

// Middleware to parse JSON body
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// In-memory task array
let tasks = [];
let nextId = 1;

// Route-specific middleware for ID validation
const validateTaskId = (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid Task ID format. Must be a positive integer.' });
    }
    req.taskId = id;
    next();
};

// --- CRUD Routes ---

// GET /tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// POST /tasks
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        id: nextId++,
        title,
        description: description || '',
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', validateTaskId, (req, res) => {
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Update fields if provided
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', validateTaskId, (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

// --- Fallback Handlers ---

// Custom 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} does not exist.`
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on the server.'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
