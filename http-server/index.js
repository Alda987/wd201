const http = require('http');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

// Parse command line arguments
const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

// Read files synchronously at startup for simplicity
const homeContent = fs.readFileSync(path.join(__dirname, 'home.html'), 'utf8');
const projectContent = fs.readFileSync(path.join(__dirname, 'projects.html'), 'utf8');
const registrationContent = fs.readFileSync(path.join(__dirname, 'registration.html'), 'utf8');

// Create server
const server = http.createServer((req, res) => {
    const url = req.url;
    
    // Set content type
    res.setHeader('Content-Type', 'text/html');
    
    // Route handling
    if (url === '/project' || url === '/projects') {
        res.end(projectContent);
    } else if (url === '/registration') {
        res.end(registrationContent);
    } else if (url === '/') {
        res.end(homeContent);
    } else {
        // Handle 404 - Not Found
        res.writeHead(404);
        res.end('<h1>404 Not Found</h1><p>The page you requested could not be found.</p>');
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Available routes:');
    console.log(`- Home: http://localhost:${port}/`);
    console.log(`- Projects: http://localhost:${port}/project`);
    console.log(`- Registration: http://localhost:${port}/registration`);
});
