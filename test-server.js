// Simple test HTTP server to check port binding
const http = require('http');

const PORT = 5177;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Akawo App Test Server</h1><p>Port 5177 is working!</p>');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
});

// Log any errors
server.on('error', (e) => {
  console.error('Server error:', e);
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try another port.`);
  }
});