# 🧪 MOOSH WALLET - COMPLETE USER TEST SIMULATION
**Date:** 2025-07-08  
**Test Environment:** localhost:3333 (UI) + localhost:3001 (API)

---

## 📋 TEST OBJECTIVE
Verify that:
1. Wallet generates real BIP39 seed phrases
2. Spark addresses match expected format and are consistent
3. Wallet details page shows the same addresses as generated
4. All data persists correctly between pages

---

## 🚀 STEP-BY-STEP USER SIMULATION

### Step 1: Initial Setup Verification
```bash
# Check servers are running
API Server: http://localhost:3001 ✅
UI Server: http://localhost:3333 ✅
```

### Step 2: Generate Test Wallet via API
First, let's generate a wallet directly through the API to know what to expect:

```bash
curl -X POST http://localhost:3001/api/spark/generate \
  -H "Content-Type: application/json" \
  -d '{"strength": 256}'
```

**Expected Wallet Data:**
- 24-word seed phrase
- Spark address starting with `sp1pgss` (65 characters)
- Bitcoin address starting with `bc1p` or `bc1q`
- Private keys in both HEX and WIF format

---

## 📱 UI WALKTHROUGH

### 1. HOMEPAGE
- Navigate to: http://localhost:3333
- You should see: MOOSH logo with "CREATE WALLET" and "IMPORT WALLET" buttons

### 2. CREATE WALLET FLOW

#### 2.1 Password Creation
- Click "CREATE WALLET"
- Enter password: `TestWallet123!`
- Confirm password: `TestWallet123!`
- Click "CREATE WALLET" button

#### 2.2 Seed Generation Page
- System automatically generates wallet
- You should see:
  - 24-word seed phrase displayed in a grid
  - Warning message about keeping seed safe
  - "COPY SEED PHRASE" button
  - "VERIFY SEED" button

**CRITICAL CHECK #1:** Write down the seed phrase displayed

#### 2.3 Seed Verification
- Click "VERIFY SEED"
- System will ask you to enter specific words from your seed
- Enter the requested words correctly
- Click "VERIFY" button

#### 2.4 Wallet Created Success
- You should see: "WALLET CREATED SUCCESSFULLY"
- Options displayed:
  - "OPEN WALLET"
  - "VIEW DETAILS"
  - "BACKUP WALLET"

### 3. WALLET DETAILS VERIFICATION

#### 3.1 Navigate to Details
- Click "VIEW DETAILS" button
- You should now be on the Wallet Details page

#### 3.2 Verify Address Consistency
**CRITICAL CHECK #2:** Compare the following:

1. **Spark Protocol Address**
   - Should start with: `sp1pgss`
   - Length: 65 characters
   - Must be the SAME as what was generated

2. **Bitcoin Address**
   - Should start with: `bc1p` (Taproot) or `bc1q` (SegWit)
   - Must match the generated address

3. **Private Keys**
   - HEX: 64 character hexadecimal string
   - WIF: Starts with 'K' or 'L' for mainnet

### 4. CROSS-VERIFICATION TEST

#### 4.1 Store Current Values
Record from the Wallet Details page:
- Seed phrase (should match what you wrote down)
- Spark address
- Bitcoin address
- Private keys

#### 4.2 Logout and Re-import
1. Go back to homepage
2. Click "IMPORT WALLET"
3. Enter the same password
4. Enter the seed phrase you recorded
5. Complete the import process

#### 4.3 Check Imported Wallet Details
- Navigate to Wallet Details again
- **CRITICAL CHECK #3:** All addresses should be IDENTICAL:
  - Same Spark address
  - Same Bitcoin address
  - Same private keys

---

## 🔍 AUTOMATED VERIFICATION SCRIPT

```javascript
// Run this in browser console on wallet details page
function verifyWalletConsistency() {
    // Get stored wallet data
    const sparkWallet = JSON.parse(localStorage.getItem('sparkWallet') || '{}');
    const currentWallet = JSON.parse(localStorage.getItem('currentWallet') || '{}');
    const generatedSeed = JSON.parse(localStorage.getItem('generatedSeed') || '[]');
    
    console.log('=== WALLET CONSISTENCY CHECK ===');
    console.log('Seed Words:', generatedSeed.length);
    console.log('Seed Phrase:', generatedSeed.join(' '));
    console.log('\nStored Addresses:');
    console.log('Spark:', sparkWallet.addresses?.spark);
    console.log('Bitcoin:', sparkWallet.addresses?.bitcoin);
    
    // Check what's displayed on page
    const displayedAddresses = {};
    document.querySelectorAll('.address-display').forEach(el => {
        const type = el.previousSibling?.textContent?.toLowerCase();
        if (type) displayedAddresses[type] = el.textContent;
    });
    
    console.log('\nDisplayed Addresses:', displayedAddresses);
    
    // Verify consistency
    const sparkMatch = sparkWallet.addresses?.spark === displayedAddresses['spark protocol'];
    console.log('\n✅ Spark Address Match:', sparkMatch);
    
    return {
        stored: sparkWallet.addresses,
        displayed: displayedAddresses,
        match: sparkMatch
    };
}

// Run the verification
verifyWalletConsistency();
```

---

## 📊 TEST RESULTS

### ✅ PASS CRITERIA
1. [ ] Wallet generates real 24-word BIP39 seed phrase
2. [ ] Spark address starts with `sp1pgss` and is 65 chars
3. [ ] Spark address on details page matches generated address
4. [ ] Re-importing seed produces identical addresses
5. [ ] Private keys are displayed correctly
6. [ ] All data persists between page navigations

### ❌ FAIL CRITERIA
- Random/fake seed phrases (repeating words)
- Spark address changes between pages
- Spark address doesn't match expected format
- Import produces different addresses
- Data loss on navigation

---

## 🎯 EXPECTED BEHAVIOR

When everything works correctly:
1. **Seed Generation**: Real, unique 24 words from BIP39 wordlist
2. **Spark Address**: Consistent `sp1pgss...` format, always the same for a given seed
3. **Persistence**: All data remains consistent across pages and sessions
4. **Import/Export**: Importing the same seed always produces the same addresses

---

## 🐛 COMMON ISSUES TO CHECK

1. **Fake Seeds**: Words like "abandon abandon abandon..."
2. **Address Mismatch**: Different Spark addresses on different pages
3. **Local Generation**: Using client-side generation instead of API
4. **Cache Issues**: Old data persisting after new generation

---

## 📝 MANUAL TEST CHECKLIST

- [ ] Start both servers (API on 3001, UI on 3333)
- [ ] Create new wallet with password
- [ ] Write down generated seed phrase
- [ ] Complete seed verification
- [ ] Navigate to wallet details
- [ ] Verify Spark address format (sp1pgss... 65 chars)
- [ ] Copy Spark address
- [ ] Go back and import the same seed
- [ ] Check that Spark address matches exactly
- [ ] Test data persistence after page refresh

---

## 🎉 SUCCESS INDICATORS

The wallet is working correctly when:
- API returns: `✅ Using EXACT Spark implementation with test vectors`
- Seed phrases have 24 unique words
- Spark addresses always start with `sp1pgss`
- Same seed always generates same addresses
- Wallet details page shows real data, not random addresses

---

## End of Test Document