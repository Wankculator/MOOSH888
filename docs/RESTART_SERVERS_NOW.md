# 🚨 RESTART SERVERS TO SEE WALLET UI

## Quick Steps:

1. **Stop current servers** (Ctrl+C in terminal windows)

2. **Start servers again:**
   ```bash
   # Terminal 1 - UI Server
   cd "/mnt/c/Users/sk84l/OneDrive/Desktop/MOOSH WALLET"
   node src/server/server.js
   ```
   
   ```bash
   # Terminal 2 - API Server
   cd "/mnt/c/Users/sk84l/OneDrive/Desktop/MOOSH WALLET"
   node src/server/api-server.js
   ```

3. **Open browser to:** `http://localhost:3333`

## What You'll See:
- MOOSH Wallet UI with "Create New Wallet" button
- Click the button to generate real wallet data
- Every click creates a new wallet with:
  - 12-word seed phrase
  - Bitcoin addresses (Legacy, SegWit, Taproot)
  - Spark Protocol address
  - Extended public key

## Alternative: Use Batch Files
Double-click these files in Windows Explorer:
- `START_BOTH_SERVERS.bat`
- or `START_MOOSH_WALLET.bat`

Then open browser to `http://localhost:3333`