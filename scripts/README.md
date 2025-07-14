# MOOSH Wallet Scripts

This directory contains utility scripts for running the MOOSH Wallet application.

## Directory Structure

```
scripts/
├── windows/        # Windows-specific scripts (.bat, .ps1)
├── unix/          # Unix/Linux scripts (.sh)
└── README.md      # This file
```

## Windows Scripts

Located in `scripts/windows/`:

- **START_API_SERVER.bat** - Starts the API server on port 3001
- **START_BOTH_SERVERS.bat** - Starts both UI and API servers
- **RESTART_API_NOW.bat** - Restarts the API server
- **START_SERVER.ps1** - PowerShell script to start servers
- **run-puppeteer-windows.ps1** - Runs Puppeteer tests on Windows

## Unix/Linux Scripts

Located in `scripts/unix/`:

- **start-api.sh** - Starts the API server on Unix systems

## Usage

### Windows
```bash
cd scripts/windows
./START_BOTH_SERVERS.bat
```

### Unix/Linux
```bash
cd scripts/unix
./start-api.sh
```

## Notes

- Ensure Node.js is installed before running any scripts
- API server runs on port 3001
- UI server runs on port 8080