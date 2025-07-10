# Spark Protocol Technical Architecture Deep Dive

## System Overview

### Architecture Type
- **Classification**: Off-chain scaling solution (not a blockchain, rollup, or sidechain)
- **Base Layer**: Bitcoin mainnet with no external consensus mechanisms
- **Design Pattern**: Statechain-based with distributed ledger functionality
- **Trust Model**: Minimal trust with 1/n or threshold/n assumptions

### Core Components Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Spark Protocol Stack                     │
├─────────────────────────────────────────────────────────────┤
│  Application Layer  │ SparkSat Wallet | Other Wallet Apps  │
├─────────────────────────────────────────────────────────────┤
│    SDK Layer        │ Spark Wallet SDK | Issuer SDK        │
├─────────────────────────────────────────────────────────────┤
│  Protocol Layer     │ FROST Signing | State Management     │
├─────────────────────────────────────────────────────────────┤
│ Operator Network    │ Spark Entities (SEs) | Coordinators  │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure     │ Lightning Network | Bitcoin L1       │
└─────────────────────────────────────────────────────────────┘
```

## Cryptographic Foundation

### FROST Signing Protocol

#### Problem Statement
Spark requires:
1. **Threshold Signing**: Only `t` out of `n` Spark Operators (SOs) needed
2. **Mandatory User Participation**: User must participate in every signature
3. **Single Schnorr Signature**: Final aggregated signature
4. **Key Tweakability**: Support for additive and multiplicative tweaks
5. **Additive Aggregatability**: Derivation of combined key shards

#### Key Generation Process

```
User Key Generation:
├── Generate: (sk_user, pk_user)
├── Independent generation
└── Self-custody model

SO Key Generation:
├── Distributed Key Generation (DKG)
├── Threshold configuration: (t, n)
├── Shamir secret sharing: ss_i for each SO
└── Collective public key: pk_so

Key Aggregation:
├── sk_agg = sk_user + sk_so
├── Y = pk_user + pk_so
└── Known to all participants
```

#### Signing Flow Architecture

```
1. Initiation
   ├── User submits signing request for message m
   └── Coordinator receives request

2. Participant Selection
   ├── Coordinator selects subset S of t SOs
   ├── Compiles nonce commitment list B
   └── Broadcasts B to all participants

3. SO Signature Shares
   ├── Each SO i computes ρ_i = H1(i, m, B)
   ├── Nonce contribution: R_i = D_ij · E_ij^ρ_i
   ├── Challenge: c = H2(R, Y, m)
   └── Signature share: z_i = d_ij + e_ij*ρ_i + λ_i*ss_i*c

4. SO Aggregation
   ├── Coordinator aggregates: z_so = Σz_i
   ├── Computes R_so = Πi∈S R_i
   └── Sends (R_so, z_so) to user

5. User Signature
   ├── User computes ρ_user = H1(0, m, B)
   ├── Nonce: R_user = D_user_j · E_user_j^ρ_user
   ├── Full nonce: R = R_so · R_user
   ├── Challenge: c = H2(R, Y, m)
   └── User share: z_user = d_user_j + e_user_j*ρ_user + sk_user*c

6. Final Signature
   └── Aggregate: (R, z) where z = z_so + z_user
```

### Key Management and Tweaking

#### Additive Tweaks
```
Purpose: sk_so' = sk_so + t
Process:
├── Define new polynomial: f'(x) = f(x) + t
└── Update each share: f'(i) = f(i) + t
```

#### Multiplicative Tweaks
```
Purpose: sk_so' = t · sk_so
Process:
└── Update each share: f'(i) = t · f(i)
```

#### Secure Tweak Distribution
```
Security Model:
├── Construct polynomial g(x) of degree t-1 where g(0) = t
├── Distribute g(i) to each SO i
├── Update shares: f'(i) = f(i) + g(i)
└── Prevents tweak value exposure
```

## State Management Architecture

### Tree Structure Design

```
Spark State Tree
├── Root Node (Genesis)
├── Branch Nodes (Intermediate states)
└── Leaf Nodes (Individual UTXOs)
    ├── Leaf ID
    ├── Tree ID
    ├── Value (satoshis)
    ├── Owner Identity Public Key
    ├── Verifying Public Key
    ├── Node Transaction (hex)
    ├── Refund Transaction (hex)
    ├── VOUT index
    ├── Signing Key Share
    ├── Status
    └── Network identifier
```

### Transaction Types and State Transitions

#### 1. Deposit Operations
```
L1 → L2 Flow:
├── User generates deposit address (P2TR)
├── Bitcoin transaction to deposit address
├── Confirmation on Bitcoin network
├── Claim operation creates Spark leaves
└── Balance available in Spark network
```

#### 2. Spark Native Transfers
```
L2 → L2 Flow:
├── Transfer initiation between Spark addresses
├── FROST signing process
├── State tree update
├── Instant settlement
└── Near-zero fees
```

#### 3. Lightning Network Integration
```
Lightning Flow:
├── Invoice creation with optional Spark address embedding
├── Payment routing (Lightning or Spark preference)
├── Cross-protocol settlement
└── Unified user experience
```

#### 4. Cooperative Exit (Withdrawal)
```
L2 → L1 Flow:
├── Exit request with speed preference
├── Fee estimation and selection
├── Cooperative signing with SOs
├── Bitcoin transaction broadcast
└── L1 confirmation
```

## Trust Model Architecture

### Moment-in-Time Trust
```
Trust Requirements:
├── Only during transaction execution
├── At least 1/n honest operators required
├── Perfect forward security post-transaction
└── Key deletion protocol enforcement

Security Properties:
├── Past transactions cannot be compromised
├── Future operator compromise irrelevant
├── Multiple operator redundancy
└── Unilateral exit capability
```

### Sovereignty Mechanisms

#### Pre-signed Transactions
```
Exit Mechanism:
├── Pre-signed exit transactions created before deposit
├── User controls exit without operator cooperation
├── Timelock-based security model
└── Unconditional fund recovery
```

#### Timelock Architecture
```
Timelock Design:
├── Relative timelocks (not absolute)
├── Decrementing timelocks per transfer
├── Most recent owner exits first
├── No forced refresh requirements
└── Watchtower support available
```

#### Exit Flow
```
Unilateral Exit Process:
├── Broadcast pre-signed transactions
├── Wait for relative timelock expiry
├── Claim funds on Bitcoin L1
├── No operator cooperation required
└── Guaranteed fund recovery
```

## Network Topology

### Spark Entity (SE) Architecture
```
SE Components:
├── Multiple Spark Operators (SOs)
├── Threshold configuration (t, n)
├── Distributed key shares
├── Coordinator node
├── Signing orchestration
└── State synchronization
```

### Operator Network Design
```
Operator Network:
├── Geographically distributed SOs
├── Independent operator entities
├── Threshold fault tolerance
├── No single point of failure
├── Redundant signing capability
└── Network effect scaling
```

### Connection Architecture
```
Client Connections:
├── WebSocket streams for real-time updates
├── HTTPS API endpoints
├── Event-driven architecture
├── Connection management
├── Automatic reconnection
└── Offline capability
```

## Performance Architecture

### Scalability Design
```
Transaction Throughput:
├── No blockchain consensus overhead
├── No sequencer bottlenecks
├── Parallel transaction processing
├── Instant settlement finality
└── Unlimited theoretical throughput
```

### Latency Optimization
```
Speed Characteristics:
├── Spark transfers: <1 second
├── Lightning payments: Near-instant
├── Deposit claiming: Bitcoin confirmation dependent
├── Withdrawal: Variable by speed selection
└── Real-time balance updates
```

### Fee Structure
```
Cost Model:
├── Spark transfers: Near-zero fees
├── Lightning: Standard Lightning fees
├── Deposits: Bitcoin network fees only
├── Withdrawals: Speed-dependent fees
└── No protocol-level fees
```

## Security Architecture

### Multi-Layer Security Model
```
Security Layers:
├── Bitcoin L1 base security
├── FROST cryptographic security
├── Threshold operator security
├── User key control
├── Pre-signed exit security
└── Perfect forward security
```

### Attack Resistance
```
Attack Vectors and Mitigations:
├── Operator collusion: Threshold model
├── Key compromise: Forward security
├── Censorship: Unilateral exit
├── DoS attacks: Multiple operators
├── Network partitions: Offline capability
└── Coercion resistance: Key deletion
```

### Cryptographic Primitives
```
Crypto Stack:
├── Schnorr signatures (Bitcoin native)
├── Elliptic Curve Cryptography (secp256k1)
├── SHA-256 hash functions
├── FROST threshold signatures
├── Taproot integration
└── BIP-39 mnemonic support
```

## Integration Architecture

### SDK Design Patterns
```
SDK Architecture:
├── TypeScript primary implementation
├── Future: Rust, Flutter, Swift SDKs
├── Event-driven programming model
├── Promise-based async operations
├── Comprehensive error handling
└── Full type safety
```

### API Design
```
API Patterns:
├── RESTful HTTP endpoints
├── WebSocket event streams
├── GraphQL potential future addition
├── Batch operation support
├── Pagination for large datasets
└── Rate limiting protection
```

### Wallet Integration Patterns
```
Integration Models:
├── Self-custodial wallet integration
├── Custodial service integration
├── Hybrid custody models
├── Hardware wallet support
├── Enterprise HSM integration
└── Custom signer implementations
```

## Token Architecture

### Token Support System
```
Token Framework:
├── Bitcoin-native token issuance
├── Stablecoin support
├── Custom token creation
├── Transfer mechanisms
├── Burn/mint operations
└── Atomic transactions
```

### Token Transaction Model
```
Token Operations:
├── Mint Input: Issuer-controlled creation
├── Transfer Input: UTXO-based transfers
├── Output management: Recipient specification
├── Status tracking: Transaction confirmation
└── History querying: Audit trail
```

## Lightning Network Integration

### Protocol Bridging
```
Lightning Integration:
├── Native BOLT11 invoice support
├── Spark address embedding in invoices
├── Automatic routing preferences
├── Cross-protocol payments
├── Zero-amount invoice handling
└── Fee estimation integration
```

### Payment Flow Architecture
```
Payment Routing:
├── Spark-preferred routing
├── Lightning fallback routing
├── Dynamic path selection
├── Fee optimization
├── Real-time settlement
└── Unified user experience
```

This technical architecture provides the foundation for understanding how to build similar Layer 2 Bitcoin solutions with focus on speed, security, and user sovereignty.
