const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 5001;

connectDB();

// Start Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});