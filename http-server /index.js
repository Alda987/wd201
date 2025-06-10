const http = require("http");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

const server = http.createServer((req, res) => {
  let filePath = "";

  if (req.url === "/") {
    filePath = "home.html";
  } else if (req.url === "/projects") {
    filePath = "project.html";
  } else if (req.url === "/registration") {
    filePath = "registration.html";
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
    return;
  }

  const fullPath = path.join(__dirname, filePath);
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Server Error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(Server is running at http://localhost:${port});
});
