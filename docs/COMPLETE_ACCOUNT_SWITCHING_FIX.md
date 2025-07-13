# Complete Account Switching & Renaming Fix

## Summary
Fixed account switching and renaming to properly update the UI and switch wallet data (addresses, balances) between accounts.

## Issues Fixed

### 1. Account Renaming Not Updating UI
- **Problem**: When renaming an account, the dashboard header continued showing the old name
- **Root Cause**: The `renameAccount` method didn't trigger state updates that the UI was listening to
- **Fix**: Updated `renameAccount` to use `this.set('accounts', accounts)` which triggers state listeners

### 2. Account Switching Not Changing Wallet Data
- **Problem**: Switching accounts only changed the name but not the actual wallet addresses or balances
- **Root Cause**: Multiple issues:
  - `loadWalletData` was a placeholder function
  - `getCurrentWalletAddress` was using legacy localStorage instead of current account data
  - Balance refresh wasn't fetching data for the new account's addresses
- **Fixes**:
  - Created `loadCurrentAccountData` method to properly load account-specific data
  - Updated `getCurrentWalletAddress` to use current account's addresses
  - Fixed `refreshBalances` to fetch balance for current account's active address

### 3. Missing Reactive Updates
- **Problem**: Dashboard wasn't listening to all necessary state changes
- **Root Cause**: Only listening to `currentAccountId` changes, not `accounts` array changes
- **Fix**: Added listener for `accounts` state changes to catch renames

## Code Changes

### 1. Enhanced State Listeners (DashboardPage)
```javascript
afterMount() {
    // Listen for account changes
    this.listenToState('currentAccountId', (newAccountId, oldAccountId) => {
        console.log('[DashboardPage] Account changed from', oldAccountId, 'to', newAccountId);
        this.updateAccountDisplay();
        this.loadCurrentAccountData();
    });
    
    // Also listen for accounts array changes (for renaming)
    this.listenToState('accounts', (newAccounts, oldAccounts) => {
        console.log('[DashboardPage] Accounts array changed');
        this.updateAccountDisplay();
    });
}
```

### 2. Proper Account Data Loading
```javascript
loadCurrentAccountData() {
    const currentAccount = this.app.state.getCurrentAccount();
    if (!currentAccount) {
        console.log('[DashboardPage] No current account found');
        return;
    }
    
    console.log('[DashboardPage] Loading data for account:', currentAccount.name);
    
    // Update wallet addresses display
    this.updateWalletAddresses(currentAccount);
    
    // Refresh balances for current account
    this.refreshBalances();
    
    // Update account indicator
    this.updateAccountIndicator();
}
```

### 3. Fixed Rename to Trigger Updates
```javascript
renameAccount(accountId, newName) {
    const accounts = [...this.state.accounts];
    const account = accounts.find(a => a.id === accountId);
    if (account) {
        account.name = newName;
        // Trigger state update to notify listeners
        this.set('accounts', accounts);
        this.persistAccounts();
        return true;
    }
    return false;
}
```

### 4. Balance Refresh Using Current Account
```javascript
async refreshBalances() {
    // Get current account and fetch fresh balance
    const currentAccount = this.app.state.getCurrentAccount();
    if (currentAccount && currentAccount.addresses) {
        // Get the selected wallet type to determine which address to use
        const walletType = this.app.state.get('selectedWalletType') || 'taproot';
        let address = '';
        
        // Select the appropriate address based on wallet type
        switch(walletType) {
            case 'segwit':
                address = currentAccount.addresses.segwit || '';
                break;
            case 'taproot':
            default:
                address = currentAccount.addresses.taproot || '';
                break;
        }
        
        if (address) {
            // Fetch fresh balance from blockchain
            const balanceSats = await this.app.apiService.fetchAddressBalance(address);
            // Update UI with new balance...
        }
    }
}
```

## Result

Now when users:

1. **Rename an account**: The dashboard header immediately updates to show the new name
2. **Switch accounts**: 
   - The account name updates
   - The wallet addresses change to the new account's addresses
   - The balance refreshes to show the new account's balance
   - All wallet data is properly isolated per account

## Testing

To test the fixes:
1. Create multiple accounts with different names
2. Switch between accounts and verify:
   - Dashboard header shows correct account name
   - Wallet addresses change
   - Balance updates (if accounts have different balances)
3. Rename an account and verify the UI updates immediately
4. Refresh the page and verify changes persist

The multi-account system now works as expected with proper data isolation and UI synchronization.