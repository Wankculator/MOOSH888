# Spark SDK Complete Integration Guide

## Installation & Setup

### Prerequisites
- Node.js 16 or later
- TypeScript support (recommended)
- Bitcoin development environment

### Package Installation
```bash
# Using npm
npm install @buildonspark/spark-sdk

# Using yarn
yarn add @buildonspark/spark-sdk

# Using pnpm
pnpm add @buildonspark/spark-sdk
```

### TypeScript Configuration
The SDK provides full TypeScript support with comprehensive type definitions.

## Core SDK Components

### 1. SparkWallet Class

#### Initialization Methods

```javascript
import { SparkWallet, BitcoinNetwork } from "@buildonspark/spark-sdk";

// Method 1: Generate new wallet
const { wallet, mnemonic } = await SparkWallet.initialize({
  options: { network: "MAINNET" }
});
console.log("Save this mnemonic:", mnemonic);

// Method 2: Restore from mnemonic
const { wallet } = await SparkWallet.initialize({
  mnemonicOrSeed: "your twelve word mnemonic phrase here",
  accountNumber: 1, // Optional: for multiple identities
  options: { network: "MAINNET" }
});

// Method 3: Use raw seed
const seedBytes = new Uint8Array([/* your seed bytes */]);
const { wallet } = await SparkWallet.initialize({
  mnemonicOrSeed: seedBytes,
  options: { network: "MAINNET" }
});

// Method 4: Custom signer
const { wallet } = await SparkWallet.initialize({
  signer: customSparkSigner,
  options: { network: "MAINNET" }
});
```

#### Configuration Options
```javascript
interface ConfigOptions {
  network: "MAINNET" | "TESTNET" | "REGTEST" | "SIGNET";
  // Additional configuration options
}
```

### 2. Wallet Identity & Addressing

```javascript
// Get wallet identity
const identityPubKey = await wallet.getIdentityPublicKey();
console.log("Identity:", identityPubKey);

// Get Spark address for receiving
const sparkAddress = await wallet.getSparkAddress();
console.log("Spark Address:", sparkAddress);
```

### 3. Balance Management

```javascript
// Get current balance
const { balance, tokenBalances } = await wallet.getBalance();
console.log(`Bitcoin Balance: ${balance} satoshis`);

// Display token balances
for (const [tokenKey, tokenBalance] of tokenBalances) {
  console.log(`Token ${tokenKey}: ${tokenBalance.balance}`);
}

// Get token information
const tokenInfo = await wallet.getTokenInfo();
tokenInfo.forEach(token => {
  console.log(`${token.tokenName} (${token.tokenSymbol}): ${token.maxSupply}`);
});
```

## Deposit Operations

### Single-Use Deposit Addresses

```javascript
// Generate new deposit address
const depositAddress = await wallet.getSingleUseDepositAddress();
console.log("Send Bitcoin to:", depositAddress);

// Get all unused deposit addresses
const unusedAddresses = await wallet.getUnusedDepositAddresses();
console.log("Unused addresses:", unusedAddresses);

// Claim deposit after confirmation
const txId = "your_deposit_transaction_id";
const claimedLeaves = await wallet.claimDeposit(txId);
console.log("Claimed deposit:", claimedLeaves);
```

### Static Deposit Addresses

```javascript
// Get reusable deposit address
const staticAddress = await wallet.getStaticDepositAddress();
console.log("Reusable deposit address:", staticAddress);

// Get quote for claiming static deposit
const quote = await wallet.getClaimStaticDepositQuote(txId, outputIndex);
console.log("Deposit quote:", quote);

// Claim static deposit
const claimResult = await wallet.claimStaticDeposit({
  transactionId: quote.txId,
  creditAmountSats: quote.creditAmountSats,
  sspSignature: quote.sspSignature,
  outputIndex: quote.outputIndex
});

// Refund static deposit if needed
const refundTx = await wallet.refundStaticDeposit(
  depositTxId,
  "refund_address",
  500 // fee in sats (minimum 300)
);
```

## Transfer Operations

### Spark-to-Spark Transfers

```javascript
// Basic transfer
const transfer = await wallet.transfer({
  receiverSparkAddress: "recipient_spark_address",
  amountSats: 10000 // 10,000 satoshis
});
console.log("Transfer completed:", transfer);

// Get transfer history
const transfers = await wallet.getTransfers(20, 0); // limit, offset
transfers.transfers.forEach(transfer => {
  console.log(`Transfer ${transfer.id}: ${transfer.totalValue} sats`);
  console.log(`Status: ${transfer.status}, Direction: ${transfer.transferDirection}`);
});
```

### Token Transfers

```javascript
// Transfer tokens
const tokenTransferId = await wallet.transferTokens({
  tokenPublicKey: "token_public_key",
  tokenAmount: BigInt(1000), // Token amount as BigInt
  receiverSparkAddress: "recipient_spark_address",
  selectedOutputs: optionalSelectedOutputs // For UTXO management
});

// Query token transaction history
const tokenTxs = await wallet.queryTokenTransactions(
  ["token_key_1", "token_key_2"], // Token public keys
  ["tx_hash_1", "tx_hash_2"] // Optional: filter by specific transactions
);
```

## Lightning Network Integration

### Creating Lightning Invoices

```javascript
// Basic invoice
const invoice = await wallet.createLightningInvoice({
  amountSats: 5000,
  memo: "Payment for services",
  expirySeconds: 3600 // 1 hour
});
console.log("Invoice:", invoice.paymentRequest);

// Invoice with embedded Spark address
const sparkInvoice = await wallet.createLightningInvoice({
  amountSats: 5000,
  memo: "Payment with Spark integration",
  includeSparkAddress: true, // Embeds Spark address in fallback field
  expirySeconds: 3600
});

// Zero-amount invoice
const zeroAmountInvoice = await wallet.createLightningInvoice({
  amountSats: 0, // Zero amount - payer specifies amount
  memo: "Flexible amount payment"
});

// Invoice for another user
const otherUserInvoice = await wallet.createLightningInvoice({
  amountSats: 1000,
  memo: "Payment to another Spark user",
  receiverIdentityPubkey: "033b4f8cf891e45e2e3995e29b3c8b3d4d4e67f8a9b2c1d3e4f567890abcdef12"
});
```

### Paying Lightning Invoices

```javascript
// Basic payment
const payment = await wallet.payLightningInvoice({
  invoice: "lnbc5u1p...", // BOLT11 invoice
  maxFeeSats: 50 // Maximum fee willing to pay
});
console.log("Payment result:", payment);

// Payment with Spark preference
const sparkPreferredPayment = await wallet.payLightningInvoice({
  invoice: "lnbc5u1p...",
  maxFeeSats: 50,
  preferSpark: true // Use Spark transfer if Spark address found in invoice
});

// Zero-amount invoice payment
const zeroAmountPayment = await wallet.payLightningInvoice({
  invoice: "lnbc...", // Zero-amount invoice
  maxFeeSats: 50,
  amountSatsToSend: 7500 // Specify amount for zero-amount invoice
});

// Get fee estimate before payment
const feeEstimate = await wallet.getLightningSendFeeEstimate({
  encodedInvoice: "lnbc5u1p..."
});
console.log(`Estimated fee: ${feeEstimate} satoshis`);
```

### Lightning Request Monitoring

```javascript
// Check invoice status
const receiveRequest = await wallet.getLightningReceiveRequest(invoiceId);
if (receiveRequest) {
  console.log(`Invoice status: ${receiveRequest.status}`);
  console.log(`Amount: ${receiveRequest.amount} sats`);
}

// Check payment status
const sendRequest = await wallet.getLightningSendRequest(paymentId);
if (sendRequest) {
  console.log(`Payment status: ${sendRequest.status}`);
  console.log(`Fee paid: ${sendRequest.fee} sats`);
}
```

## Withdrawal Operations (Cooperative Exit)

### Basic Withdrawal

```javascript
import { ExitSpeed } from "@buildonspark/spark-sdk";

// Get fee estimate first
const feeEstimate = await wallet.getWithdrawalFeeEstimate({
  amountSats: 100000,
  withdrawalAddress: "bc1p..." // Bitcoin address
});
console.log("Fee estimates:", feeEstimate);

// Initiate withdrawal
const withdrawal = await wallet.withdraw({
  onchainAddress: "bc1p...", // Bitcoin address
  amountSats: 100000, // Optional: omit to withdraw all
  exitSpeed: ExitSpeed.MEDIUM // FAST, MEDIUM, or SLOW
});

if (withdrawal) {
  console.log("Withdrawal initiated:", withdrawal.id);
  
  // Monitor withdrawal status
  const status = await wallet.getCoopExitRequest(withdrawal.id);
  console.log("Withdrawal status:", status.status);
}
```

### Exit Speed Options

```javascript
// Fast exit - higher fees, faster confirmation
const fastWithdrawal = await wallet.withdraw({
  onchainAddress: "bc1p...",
  amountSats: 50000,
  exitSpeed: ExitSpeed.FAST
});

// Slow exit - lower fees, slower confirmation
const slowWithdrawal = await wallet.withdraw({
  onchainAddress: "bc1p...",
  amountSats: 50000,
  exitSpeed: ExitSpeed.SLOW
});
```

## Event Handling & Real-Time Updates

### Setting Up Event Listeners

```javascript
// Listen for incoming transfers
wallet.on('transfer:claimed', (transferId, updatedBalance) => {
  console.log(`Transfer ${transferId} received!`);
  console.log(`New balance: ${updatedBalance} satoshis`);
  // Update UI, send notifications, etc.
});

// Listen for confirmed deposits
wallet.on('deposit:confirmed', (depositId, updatedBalance) => {
  console.log(`Deposit ${depositId} confirmed!`);
  console.log(`New balance: ${updatedBalance} satoshis`);
  // Update UI, trigger workflows, etc.
});

// Connection status monitoring
wallet.on('stream:connected', () => {
  console.log('Connected to Spark network');
  // Update connection status in UI
});

wallet.on('stream:disconnected', (reason) => {
  console.log(`Disconnected from Spark network: ${reason}`);
  // Show offline indicator, queue operations, etc.
});

wallet.on('stream:reconnecting', (attempt, maxAttempts, delayMs, error) => {
  console.log(`Reconnection attempt ${attempt}/${maxAttempts} in ${delayMs}ms`);
  console.log(`Reason: ${error}`);
  // Show reconnection progress
});
```

### Event Cleanup

```javascript
// Remove specific listener
const transferHandler = (transferId, balance) => {
  console.log('Transfer received:', transferId);
};
wallet.on('transfer:claimed', transferHandler);
wallet.off('transfer:claimed', transferHandler);

// Remove all listeners for an event
wallet.removeAllListeners('transfer:claimed');

// Remove all listeners
wallet.removeAllListeners();
```

## Advanced Features

### Custom Signer Implementation

```javascript
class CustomSparkSigner {
  async getIdentityPublicKey() {
    // Return identity public key as Uint8Array
  }
  
  async generatePublicKey(seed) {
    // Generate public key from seed
  }
  
  async generateMnemonic() {
    // Generate BIP-39 mnemonic
  }
  
  async mnemonicToSeed(mnemonic) {
    // Convert mnemonic to seed
  }
  
  async createSparkWalletFromSeed(seed, network) {
    // Create wallet from seed
  }
  
  async restoreSigningKeysFromLeafs(leaves) {
    // Restore keys from wallet leaves
  }
  
  async getTrackedPublicKeys() {
    // Return tracked public keys
  }
  
  async signMessageWithIdentityKey(message, compact) {
    // Sign message with identity key
  }
  
  async signMessage(message, publicKey) {
    // Sign message with specific key
  }
}

// Use custom signer
const customSigner = new CustomSparkSigner();
const { wallet } = await SparkWallet.initialize({
  signer: customSigner,
  options: { network: "MAINNET" }
});
```

### Advanced Deposit Handling

```javascript
// Advanced deposit with raw transaction
const txHex = "raw_transaction_hex";
const depositResult = await wallet.advancedDeposit(txHex);
console.log("Advanced deposit result:", depositResult);

// Get token L1 address for token operations
const tokenL1Address = await wallet.getTokenL1Address();
console.log("Token L1 address:", tokenL1Address);
```

### Connection Management

```javascript
// Cleanup connections when done
await wallet.cleanupConnections();

// Swap fee estimation for internal operations
const swapFeeEstimate = await wallet.getSwapFeeEstimate(10000);
console.log("Swap fee estimate:", swapFeeEstimate);
```

## Error Handling Best Practices

### Try-Catch Patterns

```javascript
try {
  const transfer = await wallet.transfer({
    receiverSparkAddress: "invalid_address",
    amountSats: 1000
  });
} catch (error) {
  console.error('Transfer failed:', error.message);
  // Handle specific error types
  if (error.code === 'INSUFFICIENT_BALANCE') {
    // Show insufficient balance message
  } else if (error.code === 'INVALID_ADDRESS') {
    // Show invalid address message
  }
}
```

### Async Error Handling

```javascript
// Handle initialization errors
try {
  const { wallet } = await SparkWallet.initialize({
    mnemonicOrSeed: "invalid mnemonic",
    options: { network: "MAINNET" }
  });
} catch (error) {
  console.error('Wallet initialization failed:', error);
  // Fallback to new wallet creation or error UI
}

// Handle network errors
wallet.on('stream:disconnected', (reason) => {
  if (reason.includes('network')) {
    // Handle network-specific issues
  } else if (reason.includes('auth')) {
    // Handle authentication issues
  }
});
```

## Testing & Development

### Network Configuration for Testing

```javascript
// Development with regtest
const { wallet } = await SparkWallet.initialize({
  options: { network: "REGTEST" }
});

// Testnet for staging
const { wallet: testWallet } = await SparkWallet.initialize({
  options: { network: "TESTNET" }
});

// Signet for additional testing
const { wallet: signetWallet } = await SparkWallet.initialize({
  options: { network: "SIGNET" }
});
```

### Account Management for Testing

```javascript
// Create multiple wallets from same mnemonic
const mnemonic = "your test mnemonic phrase";

const wallet1 = await SparkWallet.initialize({
  mnemonicOrSeed: mnemonic,
  accountNumber: 1,
  options: { network: "REGTEST" }
});

const wallet2 = await SparkWallet.initialize({
  mnemonicOrSeed: mnemonic,
  accountNumber: 2,
  options: { network: "REGTEST" }
});
```

## Production Deployment Considerations

### Connection Management
- Implement proper cleanup on app shutdown
- Handle reconnection gracefully
- Monitor connection health

### Error Recovery
- Implement retry logic for network operations
- Cache operations during offline periods
- Provide user feedback for all states

### Performance Optimization
- Batch operations where possible
- Use pagination for large data sets
- Implement proper caching strategies

### Security Best Practices
- Never log mnemonics or private keys
- Validate all user inputs
- Implement proper access controls
- Use secure storage for sensitive data

This comprehensive guide covers all aspects of integrating the Spark SDK into your application.
