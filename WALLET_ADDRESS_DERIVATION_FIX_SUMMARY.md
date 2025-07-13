# Wallet Address Derivation Fix Summary

## Issues Fixed

### 1. Address Derivation Issue (All addresses showing same value)
**Problem**: When importing a wallet, all address types (taproot, nested segwit, legacy) were showing the same address as the native segwit address.

**Root Cause**: The `getCurrentWalletAddress` function had fallback logic that would default to the nativeSegWit address when other address types were empty.

**Fix**: 
- Removed the fallback logic in `getCurrentWalletAddress` to show actual empty values instead of defaulting
- Updated the function to return "Not available" when an address type doesn't have a value
- Fixed in lines 18854-18857 of moosh-wallet.js

### 2. Case Sensitivity Issue (nestedSegwit vs nestedSegWit)
**Problem**: The API returns `nestedSegwit` (lowercase 'w') but some parts of the frontend expected `nestedSegWit` (uppercase 'W').

**Root Cause**: Inconsistent property naming between API response and frontend expectations.

**Fixes Applied**:
- Updated StateManager's createAccount to use `nestedSegwit` (lowercase) - line 2128
- Fixed address mapping in getCurrentWalletAddress to use `nestedSegwit` - line 18849
- Updated getRealWalletAddresses to check both cases - lines 11239, 11254
- Fixed sparkWallet address mapping to check bitcoinAddresses first - lines 18882-18886

### 3. Private Keys Display Issue
**Problem**: Private keys weren't showing in wallet details for imported wallets.

**Root Cause**: The createPrivateKeysSection wasn't properly accessing the allPrivateKeys from sparkWallet.

**Current State**: The code already checks for allPrivateKeys from sparkWallet (lines 10858, 10895). The issue might be in the API response structure for imported wallets.

### 4. getCurrentWalletAddress Function
**Problem**: Function was returning the wrong address for different wallet types.

**Fix**: Updated the function to:
- Not fall back to nativeSegWit when address is empty
- Return "Not available" for empty addresses
- Check bitcoinAddresses object from sparkWallet for proper address mapping

## Code Changes Summary

1. **StateManager.createAccount** (line 2128): Changed `nestedSegWit` to `nestedSegwit`
2. **getCurrentWalletAddress** (lines 18844-18857): Removed fallback logic, fixed case sensitivity
3. **Fallback address mapping** (lines 18880-18887): Added bitcoinAddresses check before addresses
4. **getRealWalletAddresses** (lines 11239, 11254): Added case-insensitive checks
5. **Address selector mapping** (line 13210): Fixed case sensitivity

## Testing Required

1. Import a wallet and verify all address types display correctly
2. Check that empty address types show "Not available" instead of the segwit address
3. Verify private keys are displayed in wallet details
4. Test address switching in the dashboard selector

## Remaining Issues

If private keys still don't display properly for imported wallets, check:
1. The API response structure from `/api/spark/import`
2. Whether the import endpoint is returning `allPrivateKeys` properly
3. The sparkCompatibleService.js import function to ensure it returns all key types