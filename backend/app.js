const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Error occurred');
});

module.exports = app;