const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(); // this will log on success or failure

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('🚀 Server is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
