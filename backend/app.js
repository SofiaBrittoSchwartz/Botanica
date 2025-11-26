require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const verifyToken = require('./middleware/auth');

const app = express();

// Global middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Auth protected routes
app.get('/', verifyToken, (req, res) => {
    res.json({ message: `Welcome user ${req.user.id}`, user: req.user });
});

// Other routers
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Error occurred');
});

module.exports = app;