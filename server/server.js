require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Required for production deployment
const app = express();

// ======================
// Middleware Setup
// ======================
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-render-frontend-url.onrender.com' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ======================
// Database Simulation
// ======================
const courses = [
  {
    id: 1,
    title: "Introduction to Data Science",
    duration: "4 weeks",
    level: "Beginner",
    description: "Learn Python, Pandas, and basic statistics for data analysis",
    instructor: "Ian Leboo",
    image: "/images/data-science-intro.jpg",
    price: 40000,
    currency: "Ksh",
    rating: 4.5
  },
  // ... (keep all your other course objects exactly as you had them)
];

// ======================
// API Endpoints
// ======================
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'PGanalytics API v1.2',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      courses: '/api/courses',
      singleCourse: '/api/courses/:id'
    }
  });
});

app.get('/api/courses', (req, res) => {
  const level = req.query.level;
  const filteredCourses = level
    ? courses.filter(c => c.level.toLowerCase() === level.toLowerCase())
    : courses;

  res.json({
    status: 'success',
    count: filteredCourses.length,
    data: filteredCourses
  });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ 
      status: 'error',
      message: 'Course not found' 
    });
  }
  res.json({ 
    status: 'success',
    data: course 
  });
});

// ======================
// Production Configuration
// ======================
if (process.env.NODE_ENV === 'production') {
  // Serve static frontend files
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing (return all requests to React app)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// ======================
// Error Handling
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// ======================
// Server Startup
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ====================================
   PGanalytics Server Started
  ====================================
  Mode:       ${process.env.NODE_ENV || 'development'}
  Port:       ${PORT}
  Database:   ${process.env.MONGODB_URI ? 'Connected' : 'In-memory'}
  Endpoints:
  - Health:   http://localhost:${PORT}/api/test
  - Courses:  http://localhost:${PORT}/api/courses
  ====================================
  `);
});