// Backend_Code/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const con = require('./server'); // MySQL connection


//Roughting  File 
const login_verification = require('./login_verification'); // <-- Import here


const app = express();
const PORT = 3000;
// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Register routes AFTER app initialized
login_verification(app, con); // <-- Angular-like routing





// Static files
app.use(express.static(path.join(__dirname, 'Frontend_Code')));

// DB Connection
con.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ DB Connected');
});

// Routes

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend_Code', 'Home_page.html'));
});



// Catch-all route for static HTML files in Public
app.get('/:page', (req, res) => {
  const file = path.join(__dirname, 'Frontend_Code', req.params.page);
  res.sendFile(file, err => {
    if (err) res.status(404).json({ success: false, message: 'Page not found' });
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
