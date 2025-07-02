const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle static files (images, etc.)
  if (req.url.endsWith('.png') || req.url.endsWith('.jpg') || req.url.endsWith('.gif') || req.url.endsWith('.ico')) {
    const filePath = path.join(__dirname, req.url);
    
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

  // Serve the main HTML page
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <title>MOOSH Wallet - Bitcoin Native Wallet</title>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* MOBILE-FIRST RESPONSIVE DESIGN - Enhanced Build Rules v4.0 */
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
            
            /* DYNAMIC SCALING SYSTEM */
            --scale-factor: 0.8;        /* Mobile first */
            --font-base: 14px;          /* Base font size */
            --spacing-unit: 8px;        /* Base spacing */
            --container-padding: 16px;  /* Mobile padding */
            --button-height: 48px;      /* Touch-friendly buttons */
            --input-height: 44px;       /* Touch-friendly inputs */
        }
        
        /* RESPONSIVE SCALING - Dynamic breakpoints */
        @media (min-width: 480px) {
            :root {
                --scale-factor: 0.85;
                --font-base: 15px;
                --container-padding: 20px;
            }
        }
        
        @media (min-width: 768px) {
            :root {
                --scale-factor: 0.9;
                --font-base: 16px;
                --container-padding: 24px;
                --button-height: 44px;
                --input-height: 40px;
            }
        }
        
        @media (min-width: 1024px) {
            :root {
                --scale-factor: 0.95;
                --font-base: 16px;
                --container-padding: 32px;
            }
        }
        
        @media (min-width: 1200px) {
            :root {
            --scale-factor: 1;
                --font-base: 16px;
                --container-padding: 40px;
            }
        }
        
        @media (min-width: 1600px) {
            :root {
                --scale-factor: 1.05;
                --font-base: 17px;
            }
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
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
            font-variant-numeric: tabular-nums;
            
            /* MOBILE OPTIMIZATION - Enhanced Build Rules v4.0 */
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        /* Typography */
        .gradient-text {
            color: var(--text-accent);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
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

        .text-keyword { color: var(--text-keyword); }
        .text-string { color: var(--text-string); }
        .text-comment { color: var(--text-comment); }
        .text-variable { color: var(--text-secondary); }
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-accent { color: var(--text-accent); }
        .text-dim { color: var(--text-dim); }

        /* Layout Components */
        .card {
            background: var(--bg-secondary);
            border: var(--border-width) solid var(--border-color);
            border-radius: 0;
            position: relative;
            transition: all var(--transition-speed) ease;
            padding: 24px;
            margin-bottom: 16px;
        }

        .card:hover {
            background: #000000;
            border-color: var(--text-primary);
        }

        /* Button System */
        .btn-primary {
            background: var(--text-primary);
            color: var(--bg-primary);
            border: none;
            border-radius: 9999px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            font-size: 14px;
            padding: 12px 24px;
            font-family: inherit;
            transform: translateZ(0);
        }

        .btn-primary:hover {
            background: var(--text-secondary);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(245, 115, 21, 0.3);
        }

        .btn-secondary {
            background: transparent;
            color: var(--text-dim);
            border: none;
            font-weight: 400;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            font-size: 14px;
            padding: 8px 16px;
            font-family: inherit;
        }

        .btn-secondary:hover {
            color: var(--text-primary);
            transform: translateY(-1px);
        }

        /* Navigation - DYNAMIC SCALING */
        .nav-link {
            color: var(--text-dim);
            font-weight: 400;
            text-decoration: none;
            position: relative;
            transition: all var(--transition-speed) ease;
            font-size: calc(var(--font-base) * var(--scale-factor) * 0.875);
            padding: calc(var(--spacing-unit) * var(--scale-factor)) calc(var(--spacing-unit) * 1.5 * var(--scale-factor));
            border-radius: calc(8px * var(--scale-factor));
            font-family: inherit;
            white-space: nowrap;
            display: inline-block;
        }

        .nav-link:hover {
            color: var(--text-primary);
            background: var(--bg-hover);
        }

        /* Brand System - DYNAMIC SCALING */
        .brand-box {
            background: transparent;
            padding: 0;
            display: inline-flex;
            align-items: center;
            gap: calc(var(--spacing-unit) * var(--scale-factor));
            font-family: inherit;
        }

        .brand-text {
            display: flex;
            align-items: center;
            gap: 0;
            font-size: calc(var(--font-base) * var(--scale-factor));
            font-weight: 600;
        }

        .brand-logo {
            width: calc(32px * var(--scale-factor));
            height: calc(32px * var(--scale-factor));
            object-fit: contain;
            border-radius: 50%;
        }

        /* Form Elements */
        .input-field {
            background: var(--bg-primary);
            border: var(--border-width) solid var(--border-color);
            border-radius: 0;
            color: var(--text-primary);
            font-family: inherit;
            transition: all var(--transition-speed) ease;
            font-size: calc(12px * var(--scale-factor));
            padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2);
            width: 100%;
            height: var(--input-height);
            
            /* MOBILE TOUCH OPTIMIZATION */
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            touch-action: manipulation;
            box-sizing: border-box;
        }

        .input-field:focus {
            border-color: var(--text-primary);
            outline: none;
            background: var(--bg-primary);
        }

        .input-field:hover {
            border-color: var(--text-primary);
            color: var(--text-primary);
        }

        /* Password Section Hover Effects */
        .password-security-subtitle:hover {
            color: var(--text-primary);
            cursor: pointer;
        }

        /* Terminal Typing Effect */
        .typing-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: calc(11px * var(--scale-factor));
            color: var(--text-primary);
            position: relative;
        }

        .typing-cursor {
            display: inline-block;
            background-color: var(--text-primary);
            width: 2px;
            height: 1em;
            margin-left: 2px;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        label.text-dim {
            font-size: calc(11px * var(--scale-factor));
        }

        label.text-dim:hover {
            color: var(--text-primary);
            cursor: pointer;
        }

        /* Cursor-style container */
        .cursor-container {
            background: var(--bg-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .cursor-header {
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-color);
            padding: 0 var(--container-padding);
            height: calc(53px * var(--scale-factor));
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .cursor-content {
            overflow-y: auto;
            padding: calc(var(--spacing-unit) * 3) var(--container-padding) calc(var(--spacing-unit) * 2) var(--container-padding);
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            box-sizing: border-box;
        }

        /* Terminal Box */
        .terminal-box {
            background: #000000;
            border: 2px solid var(--text-primary);
            border-radius: 0;
            padding: 12px;
            font-family: inherit;
            overflow: hidden;
            margin-bottom: 16px;
        }

        .terminal-header {
            color: var(--text-primary);
            margin-bottom: 8px;
            border-bottom: 1px solid var(--text-primary);
            padding-bottom: 4px;
            font-size: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .terminal-content {
            color: var(--text-primary);
            line-height: 1.2;
            font-size: 10px;
        }

        .wallet-actions {
            display: flex;
            flex-direction: column;
            gap: calc(20px * var(--scale-factor));
            align-items: center;
            margin: calc(24px * var(--scale-factor)) 0 0 0;
        }

        .token-site-subtitle {
            color: var(--text-dim);
            font-weight: 400;
            font-family: 'JetBrains Mono', monospace;
            font-size: calc(var(--font-base) * var(--scale-factor));
            letter-spacing: 0.05em;
            transition: color 0.3s ease;
            cursor: pointer;
        }

        .token-site-subtitle:hover {
            color: var(--text-primary);
        }

        /* Network Toggle Switch */
        .network-toggle {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-left: 0;
        }

        .toggle-switch {
            position: relative;
            width: 40px;
            height: 16px;
            background: #000000;
            border: 1px solid var(--text-primary);
            border-radius: 0;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .toggle-switch:hover {
            border-color: var(--text-primary);
        }

        .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 12px;
            background: transparent;
            transition: transform 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: var(--text-primary);
            font-weight: 600;
            line-height: 1;
        }

        .toggle-switch.testnet .toggle-slider {
            transform: translateX(22px);
        }

        .network-label {
            font-size: 9px;
            font-weight: 500;
            color: var(--text-primary);
            min-width: 45px;
            text-align: left;
        }

        .toggle-switch.testnet + .network-label {
            color: var(--text-primary);
        }

        /* Loading animation */
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        .blink {
            animation: blink 1s infinite;
        }

        /* Password text hover effect */
        .password-text-hover {
            color: var(--text-dim);
            transition: color 0.3s ease;
        }

        .password-text-hover:hover {
            color: var(--text-primary);
        }

        /* ENHANCED MOBILE OPTIMIZATION - Build Rules v4.0 */
        @media (max-width: 768px) {
            :root {
                --scale-factor: 0.85;
                --font-base: 14px;
                --container-padding: 16px;
                --spacing-unit: 6px;
            }
            
            .cursor-content {
                padding: calc(16px * var(--scale-factor)) calc(12px * var(--scale-factor)) calc(12px * var(--scale-factor)) calc(12px * var(--scale-factor));
            }
            
            /* HORIZONTAL LAYOUT - PROFESSIONAL MOBILE */
            h1 {
                flex-direction: row !important;
                gap: calc(6px * var(--scale-factor)) !important;
                align-items: center !important;
                justify-content: center !important;
                flex-wrap: nowrap !important;
                font-size: calc(24px * var(--scale-factor)) !important;
            }
            
            .moosh-flash, .text-dim {
                font-size: calc(18px * var(--scale-factor)) !important;
                white-space: nowrap;
            }
            
            /* OPTIMIZED LOGO SIZING */
            .moosh-logo, h1 img {
                width: calc(28px * var(--scale-factor)) !important;
                height: calc(28px * var(--scale-factor)) !important;
                flex-shrink: 0;
            }
            
            /* COMPACT SUBTITLE */
            .token-site-subtitle {
                font-size: calc(12px * var(--scale-factor)) !important;
                margin-bottom: calc(20px * var(--scale-factor)) !important;
            }
            
            /* Fix Token Site button on mobile */
            .nav-link {
                font-size: calc(var(--font-base) * var(--scale-factor) * 0.75) !important;
                padding: calc(6px * var(--scale-factor)) calc(8px * var(--scale-factor)) !important;
                border-radius: calc(6px * var(--scale-factor)) !important;
            }
            
            .cursor-header {
                height: calc(48px * var(--scale-factor)) !important;
                padding: 0 calc(12px * var(--scale-factor)) !important;
            }
            
            .network-toggle {
                margin-left: 8px;
                gap: 6px;
            }
            
            .toggle-switch {
                width: 36px;
                height: 14px;
            }
            
            .toggle-slider {
                width: 10px;
                height: 10px;
                top: 2px;
                left: 2px;
                font-size: 8px;
            }
            
            .toggle-switch.testnet .toggle-slider {
                transform: translateX(18px);
            }
            
            .network-label {
                font-size: 8px;
                min-width: 40px;
            }
            
            /* ENHANCED MOBILE FORMS & BUTTONS */
            .input-field {
                font-size: calc(12px * var(--scale-factor)) !important;
                padding: calc(10px * var(--scale-factor)) calc(12px * var(--scale-factor)) !important;
                height: calc(42px * var(--scale-factor)) !important;
                border-width: 1px !important;
            }
            
            /* MOBILE PASSWORD SECTION FIXES */
            label.text-dim {
                font-size: calc(7px * var(--scale-factor)) !important;
            }
            
            #passwordError, #passwordSuccess {
                font-size: calc(10px * var(--scale-factor)) !important;
                margin-top: calc(6px * var(--scale-factor)) !important;
            }
            
            /* MOBILE SECURITY SECTION */
            .password-security-section {
                padding: calc(16px * var(--scale-factor)) !important;
                margin-bottom: calc(12px * var(--scale-factor)) !important;
            }
            
            .password-security-title {
                font-size: calc(14px * var(--scale-factor)) !important;
                margin-bottom: calc(10px * var(--scale-factor)) !important;
            }
            
            .password-security-subtitle {
                font-size: calc(7px * var(--scale-factor)) !important;
                margin-bottom: calc(12px * var(--scale-factor)) !important;
            }
            
            .wallet-actions button {
                font-size: calc(14px * var(--scale-factor)) !important;
                padding: calc(12px * var(--scale-factor)) calc(20px * var(--scale-factor)) !important;
                height: calc(48px * var(--scale-factor)) !important;
                border-width: 1px !important;
            }
            
            .card {
                padding: calc(16px * var(--scale-factor)) !important;
                margin-bottom: 0 !important;
            }
            
            .terminal-box {
                padding: calc(8px * var(--scale-factor)) !important;
                margin-bottom: calc(12px * var(--scale-factor)) !important;
            }
            
            .terminal-header {
                font-size: calc(8px * var(--scale-factor)) !important;
                margin-bottom: calc(6px * var(--scale-factor)) !important;
                padding-bottom: calc(3px * var(--scale-factor)) !important;
            }
            
            .terminal-content {
                font-size: calc(8px * var(--scale-factor)) !important;
                line-height: 1.3 !important;
            }
            
            /* MOBILE TOUCH OPTIMIZATION */
            button, .toggle-switch, .nav-link {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                cursor: pointer;
            }
            
            /* RESPONSIVE SPACING */
            .wallet-actions {
                gap: calc(12px * var(--scale-factor)) !important;
                margin: calc(16px * var(--scale-factor)) 0 0 0 !important;
            }
            
            /* MOBILE FOOTER OPTIMIZATION */
            footer {
                padding: calc(12px * var(--scale-factor)) 0 !important;
                margin-top: calc(16px * var(--scale-factor)) !important;
            }
            
            footer div:first-child {
                font-size: calc(9px * var(--scale-factor)) !important;
                margin-bottom: calc(4px * var(--scale-factor)) !important;
            }
            
            footer div:last-child {
                font-size: calc(8px * var(--scale-factor)) !important;
                margin-top: calc(2px * var(--scale-factor)) !important;
            }
            
            /* MOBILE PASSWORD HOVER EFFECTS */
            .password-security-subtitle:hover {
                color: var(--text-primary) !important;
            }
            
            label.text-dim:hover {
                color: var(--text-primary) !important;
            }
            
            .input-field:hover {
                border-color: var(--text-primary) !important;
                color: var(--text-primary) !important;
            }
        }
    </style>
</head>
<body>
    <div class="cursor-container">
        <!-- Header -->
        <header class="cursor-header">
            <div class="brand-box">
                <img src="04_ASSETS/Brand_Assets/Logos/Moosh_logo.png" alt="MOOSH Logo" class="brand-logo" onerror="this.style.display='none'">
                <div class="brand-text">
                    <span class="text-dim">~/</span>
                    <span class="text-primary">moosh</span>
                    <span class="text-dim">/</span>
                    <span class="text-primary">wallet</span>
                    <span class="text-dim">.ts</span>
                </div>
            </div>
            
            <nav class="nav-links">
                <a href="#" onclick="openTokenSite()" class="nav-link">
                    <span class="text-dim">&lt;</span>Token Site<span class="text-dim"> /&gt;</span>
                </a>
            </nav>
        </header>

        <!-- Main Content -->
        <div class="cursor-content">
            <div class="card">
                <h1 style="text-align: center; font-size: calc(32px * var(--scale-factor)); margin-bottom: calc(8px * var(--scale-factor)); display: flex; align-items: center; justify-content: center; gap: calc(12px * var(--scale-factor));">
                    <img src="04_ASSETS/Brand_Assets/Logos/Moosh_logo.png" alt="MOOSH" style="width: calc(48px * var(--scale-factor)); height: calc(48px * var(--scale-factor)); object-fit: contain;" onerror="this.style.display='none'">
                    <span class="moosh-flash">MOOSH</span> <span class="text-dim">WALLET</span>
                </h1>
                <p class="token-site-subtitle" style="text-align: center; margin-bottom: calc(32px * var(--scale-factor));">
                    Moosh.money Spark Bitcoin wallet
                </p>
                
                <!-- Network Toggle Switch - Above Terminal Box -->
                <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                    <div class="network-toggle">
                        <div id="networkToggle" class="toggle-switch" onclick="toggleNetwork()">
                            <div class="toggle-slider">+</div>
                        </div>
                        <span id="networkLabel" class="network-label">MAINNET</span>
                    </div>
                </div>
                
                <div class="terminal-box">
                    <div class="terminal-header">
                        <span>~/moosh/spark-wallet $</span>
                        <span class="text-keyword">spark-ready <span class="blink" style="font-size: 8px;">●</span></span>
                    </div>
                    <div class="terminal-content">
                        <span style="color: var(--text-dim);"># MOOSH Spark Protocol Wallet</span><br>
                        <span class="text-keyword">import</span> <span class="text-primary">{</span> <span class="text-variable">SparkWallet</span> <span class="text-primary">}</span> <span class="text-keyword">from</span> <span class="text-keyword">"@buildonspark/spark-sdk"</span><span class="text-primary">;</span><br>
                        <span class="text-keyword">const</span> <span class="text-variable">wallet</span> <span class="text-primary">=</span> <span class="text-keyword">await</span> <span class="text-variable">SparkWallet</span><span class="text-primary">.</span><span class="text-variable">initialize</span><span class="text-primary">();</span><br>
                        <span style="color: var(--text-dim);"># Real sp1... addresses + Bitcoin Layer 2</span><br>
                        <span style="color: var(--text-keyword);"># Development Server: Bitcoin Blockchain</span>
                    </div>
                </div>

                <!-- Password Security Section -->
                <div class="password-security-section" style="background: rgba(245, 115, 21, 0.1); border: 1px solid var(--text-primary); border-radius: 0; padding: calc(20px * var(--scale-factor)); margin-bottom: calc(24px * var(--scale-factor));">
                    <div class="password-security-title" style="color: var(--text-primary); font-weight: 600; margin-bottom: calc(12px * var(--scale-factor)); font-size: calc(16px * var(--scale-factor)); text-align: center;">Moosh Wallet Security</div>
                    <div class="typing-text" style="margin-bottom: calc(20px * var(--scale-factor)); text-align: center; line-height: 1.4;">
                        <span class="text-dim">&lt;</span><span class="password-text-hover">Create a secure password to protect your wallet access</span><span class="text-dim"> /&gt;</span><span class="typing-cursor"></span>
                    </div>
                    
                    <div style="margin-bottom: calc(16px * var(--scale-factor));">
                        <label class="text-dim" style="display: block; margin-bottom: calc(8px * var(--scale-factor)); font-weight: 500;">Create Password</label>
                        <input id="createPasswordInput" class="input-field" type="password" placeholder="Enter secure password..." style="width: 100%;">
                    </div>
                    
                    <div style="margin-bottom: calc(16px * var(--scale-factor));">
                        <label class="text-dim" style="display: block; margin-bottom: calc(8px * var(--scale-factor)); font-weight: 500;">Re-enter Password</label>
                        <input id="confirmPasswordInput" class="input-field" type="password" placeholder="Confirm password..." style="width: 100%;">
                    </div>
                    
                    <div id="passwordError" style="color: #ff4444; font-size: calc(10px * var(--scale-factor)); margin-top: calc(6px * var(--scale-factor)); display: none;"></div>
                    <div id="passwordSuccess" style="color: var(--text-keyword); font-size: calc(10px * var(--scale-factor)); margin-top: calc(6px * var(--scale-factor)); display: none;">Passwords match!</div>
                </div>

                <div class="wallet-actions">
                    <button onclick="createWallet()" style="background: #000000; border: 2px solid var(--text-primary); border-radius: 0; color: var(--text-primary); font-weight: 600; font-size: calc(16px * var(--scale-factor)); padding: calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor)); font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s ease; width: 100%; text-transform: uppercase; letter-spacing: 0.1em; height: calc(56px * var(--scale-factor));" onmouseover="this.style.background='var(--text-primary)'; this.style.color='#000000'" onmouseout="this.style.background='#000000'; this.style.color='var(--text-primary)'">&lt;Create Wallet/&gt;</button>
                    
                    <button onclick="importWallet()" style="background: #000000; border: 2px solid var(--text-primary); border-radius: 0; color: var(--text-primary); font-weight: 600; font-size: calc(16px * var(--scale-factor)); padding: calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor)); font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s ease; width: 100%; text-transform: uppercase; letter-spacing: 0.1em; height: calc(56px * var(--scale-factor));" onmouseover="this.style.background='var(--text-primary)'; this.style.color='#000000'" onmouseout="this.style.background='#000000'; this.style.color='var(--text-primary)'">&lt;Import Wallet/&gt;</button>
                </div>

 
            </div>
        </div>
        
        <!-- Professional Footer - Enhanced Build Rules v4.0 Compliant -->
        <footer style="text-align: center; padding: calc(20px * var(--scale-factor)) 0; margin-top: calc(20px * var(--scale-factor)); border-top: 1px solid var(--border-color); position: relative;">
            <div style="color: var(--text-primary); font-size: calc(11px * var(--scale-factor)); font-weight: 500; letter-spacing: 0.05em; font-family: 'JetBrains Mono', monospace;">
                © 2025 MOOSH Wallet Limited. All rights reserved.
            </div>
            <div style="color: var(--text-dim); font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); font-family: 'JetBrains Mono', monospace;">
                World's First AI-Powered Bitcoin Wallet
            </div>
        </footer>
    </div>

    <script>
        // Auto-refresh every 1 minute (60000ms)
        setTimeout(function() {
            location.reload();
        }, 60000);
        
        // Network state management
        let isMainnet = true;
        
        function toggleNetwork() {
            const toggle = document.getElementById('networkToggle');
            const label = document.getElementById('networkLabel');
            const slider = toggle.querySelector('.toggle-slider');
            
            isMainnet = !isMainnet;
            
            if (isMainnet) {
                toggle.classList.remove('testnet');
                label.textContent = 'MAINNET';
                slider.textContent = '+';
                console.log('🌐 Switched to Bitcoin MAINNET');
            } else {
                toggle.classList.add('testnet');
                label.textContent = 'TESTNET';
                slider.textContent = '−';
                console.log('🧪 Switched to Bitcoin TESTNET');
            }
            
            // Update wallet network configuration
            updateWalletNetwork(isMainnet ? 'mainnet' : 'testnet');
        }
        
        function updateWalletNetwork(network) {
            // Enhanced Build Rules v4.0 - Professional Implementation
            console.log(\`🔧 Wallet configured for \${network.toUpperCase()}\`);
            
            // PROFESSIONAL NOTIFICATION SYSTEM
            showNotification(\`Network: \${network.toUpperCase()}\`, 'network');
        }
        
        function showNotification(message, type = 'info') {
            // Enhanced Build Rules v4.0 - Centralized Notification System
            const notification = document.createElement('div');
            const isMobile = window.innerWidth <= 768;
            
            // PROFESSIONAL STYLING - OWASP COMPLIANT
            notification.style.cssText = \`
                position: fixed;
                top: \${isMobile ? '70px' : '80px'};
                right: \${isMobile ? '12px' : '20px'};
                background: #000000;
                color: var(--text-primary);
                border: 2px solid var(--text-primary);
                border-radius: 0;
                padding: \${isMobile ? '6px 10px' : '8px 12px'};
                font-family: 'JetBrains Mono', monospace;
                font-size: \${isMobile ? '9px' : '10px'};
                font-weight: 500;
                z-index: 10000;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-width: \${isMobile ? '100px' : '120px'};
                max-width: \${isMobile ? '200px' : '250px'};
                text-align: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(8px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            \`;
            
            // TYPE-SPECIFIC STYLING
            if (type === 'network') {
                notification.style.borderColor = 'var(--text-primary)';
            } else if (type === 'success') {
                notification.style.borderColor = 'var(--text-accent)';
                notification.style.color = 'var(--text-accent)';
            } else if (type === 'error') {
                notification.style.borderColor = '#ff4444';
                notification.style.color = '#ff4444';
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // PROFESSIONAL ANIMATION SEQUENCE
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            });
            
            // AUTO-DISMISS WITH FADE OUT
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 2500);
        }

        function openTokenSite() {
            alert('🔗 Opening MOOSH token site...\\n\\nThis will redirect to the main token website.');
        }

        function createWallet() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            if (!password || !confirmPassword) {
                showPasswordError('Please enter and confirm your password.');
                showNotification('Password required', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showPasswordError('Passwords do not match.');
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showPasswordError('Password must be at least 8 characters long.');
                showNotification('Password too short', 'error');
                return;
            }
            
            // Professional success notification
            showNotification('Creating MOOSH Wallet...', 'success');
            setTimeout(() => {
                showNotification('1,000 MOOSH tokens earned!', 'success');
            }, 1500);
            
            console.log('🎉 MOOSH Spark wallet creation initiated');
        }

        function importWallet() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            if (!password || !confirmPassword) {
                showPasswordError('Please enter and confirm your password.');
                showNotification('Password required', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showPasswordError('Passwords do not match.');
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // Professional success notification
            showNotification('Importing MOOSH Wallet...', 'success');
            setTimeout(() => {
                showNotification('500 MOOSH tokens earned!', 'success');
            }, 1500);
            
            console.log('📥 MOOSH Spark wallet import initiated');
        }

        function showPasswordError(message) {
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }

        // Password validation
        document.getElementById('confirmPasswordInput').addEventListener('input', function() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = this.value;
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            
            if (confirmPassword && password === confirmPassword) {
                errorDiv.style.display = 'none';
                successDiv.style.display = 'block';
            } else if (confirmPassword) {
                showPasswordError('Passwords do not match.');
            }
        });
    </script>
</body>
</html>
  `);
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MOOSH Wallet Server running on http://localhost:${PORT}`);
  console.log(`🌐 Also accessible at http://0.0.0.0:${PORT}`);
  console.log(`📱 Ready for development with MOOSH logos!`);
  console.log(`🕐 Server started at: ${new Date().toISOString()}`);
}); 