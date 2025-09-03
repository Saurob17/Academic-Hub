// Backend_Code/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const con = require('./server'); // MySQL connection

const app = express();

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files (CSS, JS, images, HTML pages)
app.use(express.static(path.join(__dirname, '..', 'Public')));
app.use(express.static(path.join(__dirname, '..', 'Frontend_Code')));

// DB connect
con.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ DB Connected');
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Frontend_Code', 'Home_page.html'));
});

// Optional EJS route example
app.get('/ejs-example', (req, res) => {
  res.render('sample', { title: 'Hello EJS', message: 'Welcome to EJS page!' });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
