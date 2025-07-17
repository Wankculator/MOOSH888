# MOOSH Wallet Development Guidelines for Claude

## 🚨 CRITICAL: SEED GENERATION PRESERVATION RULES

### 📖 PRIMARY REFERENCE: `/docs/SEED_GENERATION_IMPLEMENTATION_GUIDE.md`
**ALWAYS read the implementation guide before making ANY changes to seed generation**

### NEVER MODIFY These Files Without Understanding Impact:

1. **Frontend API Calls**:
   - `/public/js/moosh-wallet.js` - Lines 1896-1922 (generateSparkWallet function)
   - `/public/js/moosh-wallet.js` - Lines 3224-3261 (generateWallet function)

2. **Backend Endpoints**:
   - `/src/server/api-server.js` - Line 126 (POST /api/spark/generate-wallet)
   - **CRITICAL**: The endpoint MUST remain `/api/spark/generate-wallet`

3. **Service Layer**:
   - `/src/server/services/sparkCompatibleService.js`
   - `/src/server/services/walletService.js`
   - `/src/server/services/sparkSDKService.js`

### Response Structure MUST Maintain:
```javascript
{
    success: true,
    data: {
        mnemonic: "string format, not array",
        addresses: {
            bitcoin: "address",
            spark: "address"
        },
        privateKeys: {
            bitcoin: { wif: "...", hex: "..." },
            spark: { hex: "..." }
        }
    }
}
```

### Before ANY Changes:

1. **Read** `/docs/SEED_GENERATION_IMPLEMENTATION_GUIDE.md` (Primary guide)
2. **Read** `/docs/SEED_GENERATION_CRITICAL_PATH.md` (Original reference)
3. **Test** seed generation is working:
   ```bash
   curl -X POST http://localhost:3001/api/spark/generate-wallet \
     -H "Content-Type: application/json" \
     -d '{"strength": 256}'
   ```
3. **Verify** response structure matches expected format

### Common Mistakes That Break Seed Generation:

- ❌ Changing endpoint from `/api/spark/generate-wallet` to anything else
- ❌ Returning mnemonic as array instead of string
- ❌ Changing response structure (e.g., `data.spark.address` instead of `data.addresses.spark`)
- ❌ Adding authentication middleware to seed generation
- ❌ Modifying timeout settings (generation takes 10-60 seconds, frontend timeout MUST be at least 60 seconds)
- ❌ Trying to "optimize" or speed up the SDK initialization

---

## General Development Rules

### 1. API Consistency
- Always maintain backward compatibility
- Never change existing endpoint URLs
- Add new endpoints instead of modifying existing ones

### 2. State Management
- Use the existing SparkStateManager for all state operations
- Don't create parallel state systems

### 3. Error Handling
- Preserve error response structures
- Add logging without changing response format

### 4. Testing Requirements
- Test seed generation after ANY frontend changes
- Test seed generation after ANY API changes
- Test seed generation after ANY service layer changes

### 5. Git Commit Rules
- Always mention if changes affect seed generation
- Reference this document in commits that touch critical paths

### 6. Recovery Procedure
If seed generation breaks, immediately restore from:
```bash
git checkout 7b831715d115a576ae1f4495d5140d403ace8213 -- [affected files]
```

---

## Working Reference
- **Last Confirmed Working**: Commit `7b831715d115a576ae1f4495d5140d403ace8213`
- **Branch**: `working-real-spark-addresses`
- **Documentation**: See `/docs/SEED_GENERATION_CRITICAL_PATH.md` for full details

---

## Development Checklist

Before submitting ANY changes:

- [ ] Seed generation still works (12 words)
- [ ] Seed generation still works (24 words)
- [ ] API returns in ~10 seconds
- [ ] Response structure unchanged
- [ ] No console errors during generation
- [ ] Generated addresses are valid format
- [ ] Private keys are properly derived

---

## Contact for Issues
If you break seed generation:
1. Check `/docs/SEED_GENERATION_CRITICAL_PATH.md`
2. Run the test script
3. Restore from working commit
4. Document what caused the break