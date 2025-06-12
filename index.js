const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const minimist = require('minimist');
const querystring = require('querystring');

const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

// In-memory storage for registrations (for demo purposes)
let registrations = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/' || pathname === '/home') {
    serveFile(res, 'home.html');
  } else if (pathname === '/projects') {
    serveFile(res, 'project.html');
  } else if (pathname === '/registration') {
    if (req.method === 'GET') {
      serveRegistrationPage(res);
    } else if (req.method === 'POST') {
      handleRegistrationForm(req, res);
    }
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

function serveFile(res, filename, contentType = 'text/html') {
  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end(`Error loading ${filename}`);
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function serveRegistrationPage(res) {
  fs.readFile(path.join(__dirname, 'registration.html'), (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading registration page');
    }

    // Inject the registrations table if it exists
    let html = data.toString();
    if (registrations.length > 0) {
      const tableHtml = generateRegistrationsTable();
      html = html.replace('</table>', `${tableHtml}</table>`);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
}

function handleRegistrationForm(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const formData = querystring.parse(body);
    const newRegistration = {
      name: formData.name || '',
      email: formData.email || '',
      password: formData.password || '',
      dob: formData.dob || '',
      terms: formData.terms === 'on' ? 'Yes' : 'No'
    };
    registrations.push(newRegistration);

    // Redirect back to the registration page to show updated table
    res.writeHead(302, { 'Location': '/registration' });
    res.end();
  });
}

function generateRegistrationsTable() {
  let tableRows = '';
  registrations.forEach(reg => {
    tableRows += `
      <tr>
        <td>${reg.name}</td>
        <td>${reg.email}</td>
        <td>${'*'.repeat(reg.password.length)}</td>
        <td>${reg.dob}</td>
        <td>${reg.terms}</td>
      </tr>
    `;
  });
  return tableRows;
}

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Registration form: http://localhost:${port}/registration`);
});

