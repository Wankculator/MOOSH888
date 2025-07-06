const http = require("http");
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle static files (images)
  if (req.url.endsWith('.png') || req.url.endsWith('.jpg') || req.url.endsWith('.gif') || req.url.endsWith('.ico')) {
    const filePath = path.join(__dirname, '../..', req.url);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.ico') contentType = 'image/x-icon';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }

  // Serve the main page with pure JavaScript DOM creation
  res.writeHead(200, {"Content-Type": "text/html"});
  
  // Build HTML as a string to avoid template literal issues
  let html = '<!DOCTYPE html>\n';
  html += '<html lang="en">\n';
  html += '<head>\n';
  html += '    <meta charset="UTF-8">\n';
  html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">\n';
  html += '    <title>MOOSH Wallet - Bitcoin Native Wallet</title>\n';
  html += '    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n';
  html += '    <style id="mainStyles"></style>\n';
  html += '</head>\n';
  html += '<body>\n';
  html += '    <script>\n';
  html += '        // Wallet initialization script\n';
  html += '        console.log("MOOSH Wallet initializing...");\n';
  html += '        \n';
  html += '        // Create a simple test interface\n';
  html += '        document.addEventListener("DOMContentLoaded", function() {\n';
  html += '            // Add styles\n';
  html += '            const styleEl = document.getElementById("mainStyles");\n';
  html += '            styleEl.textContent = `\n';
  html += '                body {\n';
  html += '                    margin: 0;\n';
  html += '                    padding: 20px;\n';
  html += '                    background: #000000;\n';
  html += '                    color: #f57315;\n';
  html += '                    font-family: "JetBrains Mono", monospace;\n';
  html += '                }\n';
  html += '                .container {\n';
  html += '                    max-width: 800px;\n';
  html += '                    margin: 0 auto;\n';
  html += '                    text-align: center;\n';
  html += '                }\n';
  html += '                h1 {\n';
  html += '                    font-size: 32px;\n';
  html += '                    margin-bottom: 20px;\n';
  html += '                }\n';
  html += '                .button {\n';
  html += '                    display: inline-block;\n';
  html += '                    margin: 10px;\n';
  html += '                    padding: 15px 30px;\n';
  html += '                    background: transparent;\n';
  html += '                    border: 2px solid #f57315;\n';
  html += '                    color: #f57315;\n';
  html += '                    text-decoration: none;\n';
  html += '                    font-weight: 600;\n';
  html += '                    cursor: pointer;\n';
  html += '                    transition: all 0.3s ease;\n';
  html += '                }\n';
  html += '                .button:hover {\n';
  html += '                    background: #f57315;\n';
  html += '                    color: #000000;\n';
  html += '                }\n';
  html += '            `;\n';
  html += '            \n';
  html += '            // Create interface\n';
  html += '            const container = document.createElement("div");\n';
  html += '            container.className = "container";\n';
  html += '            \n';
  html += '            const title = document.createElement("h1");\n';
  html += '            title.textContent = "MOOSH Wallet";\n';
  html += '            container.appendChild(title);\n';
  html += '            \n';
  html += '            const subtitle = document.createElement("p");\n';
  html += '            subtitle.textContent = "Bitcoin Native Wallet";\n';
  html += '            container.appendChild(subtitle);\n';
  html += '            \n';
  html += '            const createBtn = document.createElement("button");\n';
  html += '            createBtn.className = "button";\n';
  html += '            createBtn.textContent = "Create Wallet";\n';
  html += '            createBtn.onclick = function() {\n';
  html += '                alert("Create wallet feature coming soon!");\n';
  html += '            };\n';
  html += '            container.appendChild(createBtn);\n';
  html += '            \n';
  html += '            const importBtn = document.createElement("button");\n';
  html += '            importBtn.className = "button";\n';
  html += '            importBtn.textContent = "Import Wallet";\n';
  html += '            importBtn.onclick = function() {\n';
  html += '                alert("Import wallet feature coming soon!");\n';
  html += '            };\n';
  html += '            container.appendChild(importBtn);\n';
  html += '            \n';
  html += '            document.body.appendChild(container);\n';
  html += '        });\n';
  html += '    </script>\n';
  html += '</body>\n';
  html += '</html>';
  
  res.end(html);
});

server.listen(8080, () => {
  console.log("🚀 MOOSH Wallet Server running on http://localhost:8080");
});