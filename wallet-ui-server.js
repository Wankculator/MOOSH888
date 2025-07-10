/**
 * Simple UI Server for MOOSH Wallet
 * Serves the wallet interface with real data generation
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  let filePath = req.url;
  
  // Handle routes
  if (filePath === '/') {
    filePath = '/index.html';
  } else if (filePath === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'MOOSH Wallet UI',
      port: PORT
    }));
    return;
  }
  
  // Build full path
  const publicPath = path.join(__dirname, 'public', filePath);
  
  // Check if file exists
  fs.exists(publicPath, (exists) => {
    if (!exists) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }
    
    // Read and serve file
    fs.readFile(publicPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
        return;
      }
      
      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'text/plain';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`
===============================================
🚀 MOOSH Wallet UI Server Running!
===============================================
📍 URL: http://localhost:${PORT}
📁 Serving from: ./public/
✅ Ready for wallet generation!
===============================================
  `);
});