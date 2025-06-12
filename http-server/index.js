const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // parse query params
  const pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '/home') {
    sendFile(res, 'home.html');
  } else if (pathname === '/projects') {
    sendFile(res, 'project.html');
  } else if (pathname === '/registration' && Object.keys(parsedUrl.query).length === 0) {
    // No query => Show the form
    sendFile(res, 'registration.html');
  } else if (pathname === '/registration' && Object.keys(parsedUrl.query).length > 0) {
    // Form submitted => Show submitted data
    const { name, email, password, dob, terms } = parsedUrl.query;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Registration Successful</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Date of Birth:</strong> ${dob}</p>
      <p><strong>Accepted Terms:</strong> ${terms ? 'Yes' : 'No'}</p>
    `);
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

function sendFile(res, fileName) {
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end(`Error loading ${fileName}`);
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
