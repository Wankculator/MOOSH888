# Claude Code Windows/WSL Fix

## The Problem
The ENAMETOOLONG error occurs because of long Windows paths, especially with OneDrive folders in WSL2.

## Solutions

### Option 1: Use Native Windows Terminal (Recommended)
1. Open **Windows Terminal** or **Command Prompt** (not WSL)
2. Navigate to a shorter path:
   ```cmd
   cd C:\
   mkdir claude-temp
   cd claude-temp
   ```
3. Try authentication there:
   ```cmd
   claude auth login
   ```

### Option 2: Create Shorter WSL Path
1. In WSL, create a shorter working directory:
   ```bash
   cd ~
   mkdir claude-auth
   cd claude-auth
   claude auth login
   ```

### Option 3: Use Cline with API Key Instead
If Claude Code continues to have issues on Windows:

1. Go to https://console.anthropic.com/settings/keys
2. Create an API key
3. In VS Code Cline settings:
   - Select "Anthropic" as API Provider (not "Claude Code")
   - Enter your API key
   - This will use the API directly instead of Claude Code

### Option 4: Wait for Windows Support
Claude Code is relatively new and may not have full Windows/WSL support yet. Check for updates at:
- https://github.com/anthropics/claude-code/issues

## Recommendation
For now, I recommend **Option 3** - using the Anthropic API directly in Cline. This:
- Works reliably on Windows
- Provides the same functionality
- Avoids the path length issues

Would you like me to help you set up Option 3 with the API key instead?