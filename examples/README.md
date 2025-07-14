# MOOSH Wallet Examples

This directory contains example code demonstrating how to use the MOOSH Wallet API and integrate it into your applications.

## Available Examples

### 1. Basic Usage (`basic-usage.js`)
Demonstrates core wallet functionality:
- Generating new wallets
- Importing existing wallets
- Checking balances
- Fetching transaction history
- Setting up multi-signature wallets

### Running the Examples

1. Ensure the API server is running:
```bash
npm run dev:api
```

2. Run an example:
```bash
node examples/basic-usage.js
```

## API Integration

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Generate a new wallet
const response = await axios.post('http://localhost:3001/api/spark/generate-wallet', {
  strength: 256 // 24 words
});

console.log(response.data);
```

### cURL
```bash
# Generate wallet
curl -X POST http://localhost:3001/api/spark/generate-wallet \
  -H "Content-Type: application/json" \
  -d '{"strength": 256}'

# Check balance
curl http://localhost:3001/api/balance/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

### Python
```python
import requests

# Generate wallet
response = requests.post('http://localhost:3001/api/spark/generate-wallet', 
                        json={'strength': 256})
wallet_data = response.json()
print(wallet_data)
```

## Security Notes

⚠️ **IMPORTANT**: These examples are for educational purposes. In production:
- Never expose API endpoints without authentication
- Always use HTTPS
- Implement rate limiting
- Never log sensitive data like private keys
- Use environment variables for configuration

## Additional Resources

- [API Documentation](../docs/api/)
- [Security Best Practices](../SECURITY.md)
- [Contributing Guidelines](../CONTRIBUTING.md)