const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(`<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
</head>
<body>
    <h1>Test Server Works!</h1>
</body>
</html>`);
});

server.listen(8081, () => {
  console.log("Test server running on http://localhost:8081");
});