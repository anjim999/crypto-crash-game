const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();
const server = http.createServer(app); // <--- Wrap app in server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => { // <--- Start server, not app.listen
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB Error:', err.message));

app.get('/', (req, res) => {
  res.send('Hello from Crypto Crash backend!');
});

// 🎮 Socket.io handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Just send multiplier for now
  let multiplier = 1.0;
  const interval = setInterval(() => {
    multiplier += 0.01;
    socket.emit('multiplierUpdate', { multiplier });
  }, 100);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});
