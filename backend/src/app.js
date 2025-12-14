const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sweets', require('./routes/sweet.routes'));

module.exports = app;
