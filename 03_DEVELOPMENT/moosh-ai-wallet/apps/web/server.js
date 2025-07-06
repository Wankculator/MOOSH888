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

  // Serve the main page
  res.writeHead(200, {"Content-Type": "text/html"});
  
  // Read the HTML from an external file to avoid template literal issues
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <title>MOOSH Wallet - Bitcoin Native Wallet</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style id="mainStyles">
        /* Base styles */
        :root {
            --bg-primary: #000000;
            --bg-secondary: #000000;
            --bg-tertiary: #0a0a0a;
            --bg-hover: #1a1a1a;
            --text-primary: #f57315;
            --text-secondary: #ffffff;
            --text-accent: #69fd97bd;
            --text-string: #9bffac;
            --text-keyword: #6fedbfc2;
            --text-comment: #c8fff2;
            --text-dim: #71767b;
            --accent-color: #1d1d1d;
            --border-color: #2f3336;
            --border-active: #51555a;
            --border-width: 0.25px;
            --transition-speed: 0.2s;
            --border-radius: 16px;
            --scale-factor: 0.8;
            --font-base: 14px;
            --spacing-unit: 8px;
            --container-padding: 16px;
            --button-height: 48px;
            --input-height: 44px;
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', 'Consolas', monospace;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            font-weight: 400;
            font-size: calc(var(--font-base) * var(--scale-factor));
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
            padding: var(--container-padding);
        }
        
        .card {
            background: var(--bg-secondary);
            border: var(--border-width) solid var(--border-color);
            border-radius: 0;
            padding: 24px;
            margin-bottom: 16px;
        }
        
        .card:hover {
            background: #000000;
            border-color: var(--text-primary);
        }
        
        h1 {
            text-align: center;
            font-size: calc(32px * var(--scale-factor));
            margin-bottom: calc(8px * var(--scale-factor));
            display: flex;
            align-items: center;
            justify-content: center;
            gap: calc(12px * var(--scale-factor));
        }
        
        .moosh-flash {
            color: var(--text-dim);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            animation: mooshFlash 3s ease-in-out infinite;
        }
        
        @keyframes mooshFlash {
            0%, 70%, 100% {
                color: var(--text-dim);
            }
            15%, 55% {
                color: var(--text-primary);
                text-shadow: 0 0 10px rgba(245, 115, 21, 0.5);
            }
        }
        
        .text-dim { color: var(--text-dim); }
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        
        .wallet-actions {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 24px;
        }
        
        .wallet-actions button {
            background: #000000;
            border: 2px solid var(--text-primary);
            border-radius: 0;
            color: var(--text-primary);
            font-weight: 600;
            font-size: 16px;
            padding: 16px 32px;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            height: 56px;
        }
        
        .wallet-actions button:hover {
            background: var(--text-primary);
            color: #000000;
        }
        
        .input-field {
            width: 100%;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 0;
            padding: 12px 16px;
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            transition: all 0.2s ease;
            outline: none;
        }
        
        .input-field:focus {
            border-color: var(--text-primary);
            background: var(--bg-secondary);
        }
        
        .input-field::placeholder {
            color: var(--text-dim);
        }
        
        .password-section {
            background: rgba(245, 115, 21, 0.1);
            border: 1px solid var(--text-primary);
            border-radius: 0;
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .password-title {
            color: var(--text-primary);
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 16px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-dim);
        }
        
        .password-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .password-toggle {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            padding: 4px;
            transition: color 0.2s ease;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .password-toggle:hover {
            color: var(--text-primary);
        }
        
        .error-message {
            color: #ff4444;
            font-size: 12px;
            margin-top: 6px;
            display: none;
        }
        
        .success-message {
            color: var(--text-keyword);
            font-size: 12px;
            margin-top: 6px;
            display: none;
        }
        
        footer {
            text-align: center;
            padding: 20px 0;
            margin-top: 20px;
            border-top: 1px solid var(--border-color);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>
                <span class="moosh-flash">MOOSH</span>
                <span class="text-dim">WALLET</span>
            </h1>
            
            <p style="text-align: center; margin-bottom: 24px;">
                Moosh.money Native Bitcoin wallet
            </p>
            
            <div class="password-section">
                <div class="password-title">Moosh Wallet Security</div>
                
                <div class="form-group">
                    <label>Create Password</label>
                    <div class="password-input-wrapper">
                        <input 
                            id="createPasswordInput" 
                            class="input-field" 
                            type="password" 
                            placeholder="Enter secure password..."
                            style="padding-right: 40px;"
                        />
                        <button 
                            id="toggleCreatePassword" 
                            type="button" 
                            class="password-toggle"
                            onclick="togglePasswordVisibility('createPasswordInput', 'toggleCreatePassword')"
                            title="Show password"
                        >
                            👁
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Re-enter Password</label>
                    <div class="password-input-wrapper">
                        <input 
                            id="confirmPasswordInput" 
                            class="input-field" 
                            type="password" 
                            placeholder="Confirm password..."
                            style="padding-right: 40px;"
                        />
                        <button 
                            id="toggleConfirmPassword" 
                            type="button" 
                            class="password-toggle"
                            onclick="togglePasswordVisibility('confirmPasswordInput', 'toggleConfirmPassword')"
                            title="Show password"
                        >
                            👁
                        </button>
                    </div>
                </div>
                
                <div id="passwordError" class="error-message"></div>
                <div id="passwordSuccess" class="success-message">Passwords match!</div>
            </div>
            
            <div class="wallet-actions">
                <button onclick="createWallet()">Create Wallet</button>
                <button onclick="importWallet()">Import Wallet</button>
            </div>
        </div>
        
        <footer>
            <div style="color: var(--text-primary); font-size: 11px; font-weight: 500;">
                © 2025 MOOSH Wallet Limited. All rights reserved.
            </div>
            <div style="color: var(--text-dim); font-size: 10px; margin-top: 4px;">
                World's First AI-Powered Bitcoin Wallet
            </div>
        </footer>
    </div>
    
    <script>
        // Wallet functions
        function togglePasswordVisibility(inputId, buttonId) {
            const input = document.getElementById(inputId);
            const button = document.getElementById(buttonId);
            
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '👁‍🗨';
            } else {
                input.type = 'password';
                button.textContent = '👁';
            }
        }
        
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            
            notification.style.cssText = 'position: fixed;' +
                'top: 20px;' +
                'right: 20px;' +
                'background: #000000;' +
                'color: #f57315;' +
                'border: 2px solid #f57315;' +
                'padding: 12px 20px;' +
                'font-family: "JetBrains Mono", monospace;' +
                'font-size: 14px;' +
                'z-index: 1000;' +
                'transition: all 0.3s ease;';
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
        
        function createWallet() {
            console.log('Create wallet function called');
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            if (!password || !confirmPassword) {
                showNotification('Please enter and confirm password', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                document.getElementById('passwordError').style.display = 'block';
                document.getElementById('passwordError').textContent = 'Passwords do not match!';
                document.getElementById('passwordSuccess').style.display = 'none';
                return;
            }
            
            document.getElementById('passwordError').style.display = 'none';
            document.getElementById('passwordSuccess').style.display = 'block';
            
            showNotification('Creating wallet...', 'success');
            
            // Simulate wallet creation
            setTimeout(() => {
                showNotification('Wallet created successfully!', 'success');
                // Here you would typically navigate to the dashboard
                alert('Wallet created! Dashboard feature coming soon.');
            }, 2000);
        }
        
        function importWallet() {
            showNotification('Import wallet feature coming soon!', 'info');
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('MOOSH Wallet initialized');
        });
    </script>
</body>
</html>`;
  
  res.end(htmlContent);
});

server.listen(8080, () => {
  console.log("🚀 MOOSH Wallet Server running on http://localhost:8080");
});