const http = require("http");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

const server = http.createServer((req, res) => {
  // Default to home.html for root path
  let filePath = req.url === "/" ? "home.html" : req.url;

  // Sanitize the path and prevent directory traversal
  filePath = path.join(__dirname, decodeURIComponent(filePath));

  // Get file extension and content type
  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg"
  };
  const contentType = contentTypeMap[ext] || "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { "Content-Type": "text/plain" });
      res.end(err.code === 'ENOENT' ? "404 Not Found" : "500 Internal Server Error");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
