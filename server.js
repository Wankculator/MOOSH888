const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3333;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Parse URL
  let filePath = req.url;
  
  // Handle logo requests from any path
  if (filePath.includes('Moosh_logo.png')) {
    filePath = '/04_ASSETS/Brand_Assets/Logos/Moosh_logo.png';
  } else if (filePath === '/') {
    filePath = '/index.html';
  } else if (filePath === '/favicon.ico') {
    // Use the logo as favicon
    filePath = '/04_ASSETS/Brand_Assets/Logos/Moosh_logo.png';
  }
  
  // Security: prevent directory traversal
  filePath = filePath.replace(/\.\./g, '');
  
  // Get absolute path - try public dir first, then root dir
  let absolutePath = path.join(PUBLIC_DIR, filePath);
  
  // Check if file exists in public dir
  fs.access(absolutePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Try root directory for assets
      absolutePath = path.join(__dirname, filePath);
      
      fs.access(absolutePath, fs.constants.F_OK, (err2) => {
        if (err2) {
          // File not found
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        
        serveFile(absolutePath, res);
      });
    } else {
      serveFile(absolutePath, res);
    }
  });
});

function serveFile(absolutePath, res) {
  // Get file extension
  const ext = path.extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  // Read and serve file
  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    
    // Set proper headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length,
      'Cache-Control': 'no-cache'
    });
    
    res.end(data);
  });
}

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 MOOSH Wallet Server - Professional Edition
============================================
🌐 Local:    http://localhost:${PORT}
🌐 Network:  http://0.0.0.0:${PORT}
📁 Serving:  ${PUBLIC_DIR}
🕐 Started:  ${new Date().toISOString()}
💻 Mode:     100% Pure JavaScript Implementation
============================================
  `);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});