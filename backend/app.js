const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Error occurred');
});

module.exports = app;