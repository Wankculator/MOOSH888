#!/bin/bash

echo "🧪 Testing MOOSH Wallet API Endpoints"
echo "====================================="
echo ""

API_URL="http://localhost:3001"

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
curl -s "$API_URL/health" | python3 -m json.tool
echo ""

# Test 2: Generate Wallet
echo "2. Testing Wallet Generation..."
curl -s -X POST "$API_URL/api/wallet/generate" \
  -H "Content-Type: application/json" \
  -d '{"wordCount": 12, "network": "MAINNET"}' | python3 -m json.tool
echo ""

# Test 3: Validate Address
echo "3. Testing Address Validation..."
curl -s -X POST "$API_URL/api/wallet/validate" \
  -H "Content-Type: application/json" \
  -d '{"address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "type": "bitcoin"}' | python3 -m json.tool
echo ""

# Test 4: Import Wallet
echo "4. Testing Wallet Import..."
curl -s -X POST "$API_URL/api/wallet/import" \
  -H "Content-Type: application/json" \
  -d '{"mnemonic": "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"}' | python3 -m json.tool | head -30
echo ""

echo "====================================="
echo "✅ API tests complete!"