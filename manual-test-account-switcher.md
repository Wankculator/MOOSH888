# 🧪 Manual Test Guide: AccountSwitcher Component

## Overview
This guide helps you manually test the AccountSwitcher functionality in MOOSH Wallet.

## Prerequisites
1. Start the API server: `npm start`
2. Open browser to: http://localhost:3002
3. Ensure you have at least 2 accounts created

## Test Cases

### ✅ Test 1: Component Visibility
1. Navigate to Dashboard
2. Look at the top header
3. **Expected**: You should see an account switcher button showing the current account name and balance

### ✅ Test 2: Dropdown Toggle
1. Click on the account switcher button
2. **Expected**: A dropdown menu appears showing all accounts
3. Click the button again
4. **Expected**: The dropdown closes

### ✅ Test 3: Visual Indicators
1. Open the dropdown
2. **Expected**: 
   - Current account is highlighted with orange color
   - Other accounts show in green
   - Hover effects work (orange highlight)

### ✅ Test 4: Account Switching
1. Open the dropdown
2. Click on a different account
3. **Expected**:
   - Dropdown closes
   - Account name in button updates
   - Dashboard data refreshes with new account
   - Balance updates to show new account's balance

### ✅ Test 5: Click Outside
1. Open the dropdown
2. Click anywhere outside the dropdown
3. **Expected**: Dropdown closes

### ✅ Test 6: State Persistence
1. Switch to a different account
2. Refresh the page (F5)
3. **Expected**: The selected account remains active after refresh

### ✅ Test 7: Balance Display
1. Check each account in the dropdown
2. **Expected**: Each account shows its Bitcoin balance

### ✅ Test 8: Responsive Design
1. Resize browser window
2. **Expected**: AccountSwitcher scales properly with UI

## Visual Checklist

- [ ] Button has green border, changes to orange on hover
- [ ] Dropdown has proper shadow and border
- [ ] Active account has orange background tint
- [ ] Account names truncate with ellipsis if too long
- [ ] Balances show in appropriate color (green/orange)
- [ ] Smooth transitions on hover/click

## Console Commands for Testing

Open browser console (F12) and run these commands:

```javascript
// Check current account
app.state.getCurrentAccount()

// List all accounts
app.state.getAccounts()

// Switch account programmatically
app.state.switchAccount(app.state.getAccounts()[1].id)

// Create test account
app.state.createAccount('Test Account X')
```

## Known Issues to Check
- [ ] Dropdown should not go off-screen if many accounts
- [ ] Account switching should be instant (< 100ms)
- [ ] No console errors during operation
- [ ] Proper cleanup when switching pages

## Reporting Issues
If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Take screenshots if visual issues
4. Document expected vs actual behavior