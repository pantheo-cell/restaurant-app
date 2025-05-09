require('dotenv').config();
const express = require('express');
const cors = require('cors');

const testRoute = require('./routes/testRoute');
const userRoutes = require('./routes/userRoutes');
const protectedRoute = require('./routes/protectedRoute');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Προσωρινό route για να δεις αν λειτουργεί το API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api', testRoute);
app.use('/api', userRoutes);
app.use('/api', protectedRoute);
app.use('/api', reservationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
