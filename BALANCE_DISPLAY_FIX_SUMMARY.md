# Balance Display Fix Summary

## Issues Found and Fixed

### 1. **Memory Leak from Uncleared Intervals**
- **Problem**: The `DashboardPage` class didn't properly clean up intervals when the page was destroyed/navigated away from.
- **Impact**: Multiple interval instances would keep running, potentially causing conflicting updates and memory leaks.
- **Fix**: Added a `destroy()` method to `DashboardPage` that properly clears all intervals:
  - `refreshInterval` (30-second balance refresh)
  - `priceInterval` (30-second price updates)
  - `mempoolInterval` (60-second mempool data updates)

### 2. **API Response Format Mismatch**
- **Problem**: The `refreshBalances` method was incorrectly handling the balance data from the API.
- **Impact**: Balance calculations were wrong because the code assumed the API returned satoshis but it actually returns BTC.
- **Fix**: Updated the balance calculation to correctly handle BTC format from the API:
  ```javascript
  // Before: const balanceSats = balanceData.data ? parseFloat(balanceData.data.balance) * 100000000 : 0;
  // After: Properly documented that API returns BTC, not satoshis
  const btcBalanceFromAPI = balanceData.data ? parseFloat(balanceData.data.balance) : 0;
  const balanceSats = btcBalanceFromAPI * 100000000; // Convert to satoshis for storage
  ```

### 3. **Default Wallet Type Inconsistency**
- **Problem**: Different parts of the code had different default wallet types ('nativeSegWit' vs 'taproot').
- **Impact**: Wrong addresses could be used for balance fetching.
- **Fix**: Standardized all default wallet types to 'taproot' throughout the application.

### 4. **Balance Display Update Logic**
- **Problem**: The balance display update was checking `isBalanceHidden` state unnecessarily.
- **Impact**: Balance might not update if the state was incorrectly set.
- **Fix**: Added better logging and error handling to track when balance updates fail.

## Code Changes Made

1. **In `refreshBalances` method (line ~20454)**:
   - Changed default wallet type from 'nativeSegWit' to 'taproot'
   - Fixed balance calculation to handle BTC format from API correctly
   - Added logging for debugging balance display updates

2. **In `DashboardPage` class (line ~18304)**:
   - Added `destroy()` method to properly clean up all intervals
   - Changed default wallet type in `afterMount()` from 'nativeSegWit' to 'taproot'

## Testing Recommendations

1. **Test Navigation**: Navigate away from and back to the dashboard multiple times to ensure intervals are properly cleaned up.

2. **Test Balance Updates**: 
   - Monitor the browser console for balance update logs
   - Verify balance displays correctly after initial load
   - Check that balance continues to update every 30 seconds

3. **Test Wallet Type Switching**: 
   - Switch between different wallet types (taproot, segwit, legacy, etc.)
   - Ensure the correct address is used for each type
   - Verify balance updates correctly for each wallet type

4. **Use Debug Tool**: A debug tool has been created at `debug-balance-issue.html` to help monitor:
   - State changes
   - Balance updates
   - API responses
   - Interval execution

## Root Cause

The primary issue was that when navigating away from the dashboard, the intervals (refresh, price update, mempool) were not being cleared. This caused multiple instances of these intervals to run simultaneously when returning to the dashboard, leading to:
- Conflicting state updates
- Potential race conditions
- Memory leaks
- Balance display being overwritten with stale or incorrect data

The secondary issue was the incorrect handling of the API response format, which could cause the balance to display as 0 or an incorrect value.

## Prevention

To prevent similar issues in the future:
1. Always implement `destroy()` methods for components that use intervals or timers
2. Ensure consistent default values across the application
3. Properly document API response formats
4. Add comprehensive logging for debugging state updates
5. Use the browser's Performance tab to monitor for memory leaks from uncleared intervals