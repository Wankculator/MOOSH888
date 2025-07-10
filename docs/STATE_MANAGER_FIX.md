# StateManager Delete Method Fix

## 🐛 Error Fixed

**Error Message**: 
```
Uncaught TypeError: this.app.state.delete is not a function
    at GenerateSeedPage.afterMount (moosh-wallet.js:3180:34)
```

## 🔧 Solution

Added the missing `delete` method to the StateManager class:

```javascript
delete(key) {
    const oldValue = this.state[key];
    delete this.state[key];
    this.emit(key, undefined, oldValue);
}
```

**Location**: moosh-wallet.js, lines 1578-1582

## ✅ What This Fixes

1. **Wallet Generation Page** - No longer crashes when navigating to generate-seed
2. **Skip Verification** - Works properly without errors
3. **State Cleanup** - Properly clears old wallet data before generating new ones

## 🎯 Testing Instructions

1. Open http://localhost:3334
2. Click "Create Wallet"
3. The page should load without errors
4. Enter a password and continue
5. Seed generation should work properly
6. Skip Verification should navigate to wallet-details

## 📝 Technical Details

The GenerateSeedPage was trying to clear state values using:
- `this.app.state.delete('generatedSeed')`
- `this.app.state.delete('sparkWallet')`
- `this.app.state.delete('currentWallet')`

But the StateManager class only had `get()`, `set()`, and `update()` methods. The `delete()` method was missing, causing the TypeError.

The fix adds a proper delete method that:
1. Stores the old value
2. Deletes the key from the state object
3. Emits a change event with undefined as the new value

## ✨ Result

The wallet creation flow now works smoothly without any JavaScript errors!