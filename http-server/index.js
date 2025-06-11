const http = require('http');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// Parse command line argument
const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

const server = http.createServer((req, res) => {
  let filePath = '';
  
  if (req.url === '/' || req.url === '/home') {
    filePath = path.join(__dirname, 'home.html');
  } else if (req.url === '/projects') {
    filePath = path.join(__dirname, 'project.html');
  } else if (req.url === '/registration') {
    filePath = path.join(__dirname, 'registration.html');
  } else {
    res.writeHead(404);
    return res.end('Page not found');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end(`Error loading ${filePath}`);
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});