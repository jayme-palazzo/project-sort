const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const locationRoutes = require('./src/routes/locations');
const initDefaultCategories = require('./scripts/initDefaultCategories');
const initDefaultLocation = require('./scripts/initDefaultLocation');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db')
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Initialize default categories and location after successful connection
      await Promise.all([
        initDefaultCategories(),
        initDefaultLocation()
      ]);
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/locations', locationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Prism API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 