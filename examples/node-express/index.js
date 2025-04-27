require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ~~~snpp_project_name_placeholder~~~',
    status: 'Server is running'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`~~~snpp_project_name_placeholder~~~ server is running on port ${PORT}`);
});