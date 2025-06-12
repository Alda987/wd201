const http = require("http");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

const server = http.createServer((req, res) => {
  let filePath = "";

  if (req.url === "/" || req.url === "/home.html") {
    filePath = path.join(__dirname, "home.html");
  } else if (req.url === "/project.html") {
    filePath = path.join(__dirname, "project.html");
  } else if (req.url === "/registration") {
    filePath = path.join(__dirname, "registration.html");
  } else if (req.url === "/index.js") {
    filePath = path.join(__dirname, "index.js");
    res.setHeader("Content-Type", "text/javascript");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }

  // Set default content type
  const ext = path.extname(filePath);
  const contentType = {
    ".html": "text/html",
    ".js": "text/javascript"
  }[ext] || "text/plain";

  res.writeHead(200, { "Content-Type": contentType });

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Internal Server Error");
    } else {
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
