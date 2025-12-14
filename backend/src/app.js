const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Allow frontend origin
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sweets', require('./routes/sweet.routes'));

module.exports = app;
