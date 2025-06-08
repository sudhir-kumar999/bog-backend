require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.cjs');
const blogRoutes = require('./routes/blogRoutes.cjs');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/posts', blogRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 