#!/bin/bash

echo "════════════════════════════════════════════════════════════════════════════════"
echo "                  MOOSH WALLET - COMPREHENSIVE VERIFICATION TEST"
echo "════════════════════════════════════════════════════════════════════════════════"
echo "Test Date: $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1. TESTING COMPLETE WALLET GENERATION WITH ALL ADDRESSES"
echo "────────────────────────────────────────────────────────────────────────────────"

# Generate wallet with all features
WALLET_RESPONSE=$(curl -s -X POST http://localhost:3001/api/spark/generate-wallet \
  -H "Content-Type: application/json" \
  -d '{"strength": 256}')

# Save the seed phrase for later tests
SEED_PHRASE=$(echo "$WALLET_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['data']['mnemonic'] if 'data' in d else 'ERROR')")

echo "$WALLET_RESPONSE" | python3 -c "
import json, sys

try:
    data = json.load(sys.stdin)
    
    if data.get('success'):
        wallet = data['data']
        
        print('${GREEN}✅ WALLET GENERATED SUCCESSFULLY!${NC}')
        print('')
        
        # Seed phrase
        print('📝 SEED PHRASE (24 words):')
        print(wallet.get('mnemonic', 'ERROR'))
        print('')
        
        # All addresses
        print('💰 ALL WALLET ADDRESSES:')
        print('─' * 80)
        
        # Check all Bitcoin addresses
        btc_addrs = wallet.get('bitcoinAddresses', {})
        addresses_found = []
        
        # Native SegWit
        segwit = btc_addrs.get('segwit', 'NOT FOUND')
        print(f'1. Native SegWit (bc1q...): {segwit}')
        if segwit != 'NOT FOUND' and segwit.startswith('bc1q'):
            addresses_found.append('✅ Native SegWit')
        else:
            addresses_found.append('❌ Native SegWit')
            
        # Taproot
        taproot = btc_addrs.get('taproot', 'NOT FOUND')
        print(f'2. Taproot (bc1p...):       {taproot}')
        if taproot != 'NOT FOUND' and taproot.startswith('bc1p'):
            addresses_found.append('✅ Taproot')
        else:
            addresses_found.append('❌ Taproot')
            
        # Nested SegWit
        nested = btc_addrs.get('nestedSegwit', 'NOT FOUND')
        print(f'3. Nested SegWit (3...):    {nested}')
        if nested != 'NOT FOUND' and (nested.startswith('3') or nested.startswith('2')):
            addresses_found.append('✅ Nested SegWit')
        else:
            addresses_found.append('❌ Nested SegWit')
            
        # Legacy
        legacy = btc_addrs.get('legacy', 'NOT FOUND')
        print(f'4. Legacy (1...):           {legacy}')
        if legacy != 'NOT FOUND' and legacy.startswith('1'):
            addresses_found.append('✅ Legacy')
        else:
            addresses_found.append('❌ Legacy')
            
        # Spark
        spark = wallet.get('addresses', {}).get('spark', 'NOT FOUND')
        print(f'5. Spark Protocol:          {spark}')
        if spark != 'NOT FOUND' and spark.startswith('sp1p'):
            addresses_found.append('✅ Spark')
        else:
            addresses_found.append('❌ Spark')
            
        print('')
        print('ADDRESS VERIFICATION:')
        for addr in addresses_found:
            print(f'  {addr}')
            
        # Private Keys
        print('')
        print('🔑 PRIVATE KEY VERIFICATION:')
        print('─' * 80)
        
        all_keys = wallet.get('allPrivateKeys', {})
        keys_found = []
        
        # Check each address type has private keys
        for addr_type in ['segwit', 'taproot', 'nestedSegwit', 'legacy', 'spark']:
            if addr_type in all_keys:
                key_data = all_keys[addr_type]
                if isinstance(key_data, dict):
                    hex_key = key_data.get('hex', '')
                    wif_key = key_data.get('wif', '')
                else:
                    hex_key = key_data
                    wif_key = ''
                    
                if hex_key and len(hex_key) >= 64:
                    keys_found.append(f'✅ {addr_type.title()} private key')
                else:
                    keys_found.append(f'❌ {addr_type.title()} private key')
            else:
                keys_found.append(f'❌ {addr_type.title()} private key')
                
        for key in keys_found:
            print(f'  {key}')
            
        # Summary
        print('')
        print('📊 VERIFICATION SUMMARY:')
        print('─' * 80)
        
        total_addresses = len(addresses_found)
        valid_addresses = sum(1 for a in addresses_found if '✅' in a)
        total_keys = len(keys_found)
        valid_keys = sum(1 for k in keys_found if '✅' in k)
        
        print(f'Addresses: {valid_addresses}/{total_addresses} valid')
        print(f'Private Keys: {valid_keys}/{total_keys} valid')
        
        if valid_addresses == total_addresses and valid_keys >= 4:
            print('')
            print('${GREEN}✅ ALL WALLET FEATURES WORKING!${NC}')
        else:
            print('')
            print('${RED}❌ SOME FEATURES MISSING${NC}')
            
    else:
        print('${RED}❌ ERROR: Wallet generation failed!${NC}')
        print(f'Response: {json.dumps(data, indent=2)}')
        
except Exception as e:
    print(f'${RED}❌ ERROR parsing response: {e}${NC}')
"

echo ""
echo "2. TESTING SEED PHRASE IMPORT WITH COMPLETE DATA"
echo "────────────────────────────────────────────────────────────────────────────────"

if [ "$SEED_PHRASE" != "ERROR" ] && [ -n "$SEED_PHRASE" ]; then
    echo "Importing wallet from seed phrase..."
    
    IMPORT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/wallet/import \
      -H "Content-Type: application/json" \
      -d "{\"mnemonic\": \"$SEED_PHRASE\", \"network\": \"MAINNET\"}")
    
    echo "$IMPORT_RESPONSE" | python3 -c "
import json, sys

try:
    data = json.load(sys.stdin)
    
    if data.get('success'):
        wallet = data['data']
        
        print('${GREEN}✅ IMPORT SUCCESSFUL!${NC}')
        print('')
        
        # Check what was imported
        btc = wallet.get('bitcoin', {})
        spark = wallet.get('spark', {})
        
        import_results = []
        
        # Check Bitcoin data
        if btc:
            for addr_type in ['segwit', 'taproot', 'nestedSegwit', 'legacy']:
                if addr_type in btc and btc[addr_type].get('address'):
                    import_results.append(f'✅ {addr_type.title()} imported')
                else:
                    import_results.append(f'❌ {addr_type.title()} missing')
                    
        # Check Spark data
        if spark and spark.get('address'):
            import_results.append('✅ Spark imported')
        else:
            import_results.append('❌ Spark missing')
            
        print('IMPORT VERIFICATION:')
        for result in import_results:
            print(f'  {result}')
            
    else:
        print('${RED}❌ Import failed!${NC}')
        
except Exception as e:
    print(f'${RED}❌ Error: {e}${NC}')
"
else
    echo -e "${RED}❌ No seed phrase to test import${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo "                              TEST COMPLETE"
echo "════════════════════════════════════════════════════════════════════════════════"