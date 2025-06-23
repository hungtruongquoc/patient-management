const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the dist directory
app.use(express.static('dist'));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 