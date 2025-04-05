require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Sample Data
const courses = [
  {
    id: 1,
    title: "Introduction to Data Science",
    duration: "4 weeks",
    level: "Beginner",
    price: 40000,
    currency: "Ksh"
  }
  // Add other courses here...
];

// Routes
app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'API Working' });
});

app.get('/api/courses', (req, res) => {
  res.json({ status: 'success', data: courses });
});

// Production Setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  📌 Mode: ${process.env.NODE_ENV || 'development'}
  🔗 API: http://localhost:${PORT}/api/test
  `);
});