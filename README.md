# Rig It 🔧

A gamified raffle engine with ritualized rounds called **Explorations** on Solana.

## Overview

Rig It is a protocol where users deposit tokens into one of 36 "Rigs" during timed Exploration rounds. At the end of each round, one winning Rig is selected via verifiable randomness, and payouts are distributed according to a defined split.

### Key Features

- **3 Blocks (Arenas)**: SOL Block, PUMP Block, SKR Block
- **36 Rigs per Block**: Mini-pools for deposits
- **9 Explorations per Day**: 2 hours active + 40 minutes cooldown
- **Sublinear Ticket Weights**: sqrt-based to reduce whale dominance
- **$RIG Multiplier**: Hold $RIG for up to 3x ticket bonus
- **Anti-Snipe Protection**: Final 5 minutes deposits roll to next round
- **Commit-Reveal Randomness**: Manipulation-resistant winner selection

### Payout Mechanism

Given T = total deposits, W = winning rig deposits, L = losing rig deposits:

1. **Loser Refunds**: 50% of their deposit returned
2. **Remaining Pool**: R = W + L/2
3. **R Split**:
   - 50% → Winners (pro-rata by tickets)
   - 15% → Buyback + Burn $RIG
   - 15% → Buyback + LP Lock
   - 10% → Team Operations
   - 10% → Ecosystem/Retention

## Project Structure

```
rig-it/
├── programs/rig-it/       # Anchor Solana program
├── packages/
│   ├── sdk/               # TypeScript SDK
│   └── orchestrator/      # Backend service
├── apps/web/              # Next.js frontend
├── tests/                 # Anchor tests
└── scripts/               # Dev utilities
```

## Quick Start

### Prerequisites

- Rust 1.70+
- Solana CLI 1.17+
- Anchor 0.29+
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone and install dependencies
git clone <repo>
cd rig-it
pnpm install

# Build the Anchor program
anchor build

# Run tests
anchor test
```

### Local Development

```bash
# Terminal 1: Start local validator
solana-test-validator

# Terminal 2: Deploy and initialize
anchor deploy
npx ts-node scripts/init-local.ts

# Terminal 3: Start the web app
cd apps/web
pnpm dev
```

### Simulate an Exploration

```bash
# Start a new exploration
npx ts-node scripts/simulate-exploration.ts start

# Make test deposits
npx ts-node scripts/simulate-exploration.ts deposit

# Finalize (commit-reveal randomness)
npx ts-node scripts/simulate-exploration.ts finalize
```

## Architecture

### On-Chain (Anchor Program)

**Accounts:**
- `ProtocolConfig`: Global settings, fee splits, admin keys
- `BlockState`: Per-block configuration (asset, threshold)
- `ExplorationState`: Round state (deposits, timing, winner)
- `RigState`: Per-rig deposit totals
- `DepositReceipt`: Individual user deposits

**Instructions:**
- `init_protocol` / `init_block`
- `start_exploration`
- `deposit_to_rig`
- `commit_randomness` / `reveal_randomness`
- `refund_loser` / `claim_winnings`
- `allocate_buyback_budget`
- `emergency_pause`

### Off-Chain (Orchestrator)

- Event listener for on-chain events
- Scheduler for exploration lifecycle
- Buyback executor (2-5h randomized window)
- Privacy Cash integration (stubbed)

### Frontend (Next.js)

- Block selector
- 36-rig grid visualization
- Real-time countdown timer
- Deposit modal with ticket calculator
- User deposits and claims
- Exploration history

## Security Considerations

### Implemented (MVP)

- ✅ Commit-reveal randomness with timeout fallback
- ✅ Anti-snipe window (final 5 minutes)
- ✅ Sublinear ticket weights (sqrt-based)
- ✅ Capped $RIG multiplier (max 3x)
- ✅ Admin/operator role separation
- ✅ Emergency pause functionality
- ✅ Idempotent claims (no double refund/claim)

### Future (Not in MVP)

- Per-wallet deposit caps
- Sybil friction passes
- VRF integration
- Advanced swap routing
- Multi-sig admin

## Testing

```bash
# Run all tests
anchor test

# Run specific test
anchor test -- --grep "should deposit to a rig"
```

### Test Coverage

- Protocol/Block initialization
- Deposit validation
- Rollover when threshold not met
- Payout calculation (R = W + L/2)
- Loser refund (50% only)
- Winner pro-rata distribution
- Anti-snipe behavior
- Commit-reveal randomness
- Emergency pause

## Environment Variables

```bash
SOLANA_RPC_URL=http://127.0.0.1:8899
RIG_IT_PROGRAM_ID=<program_id>
RIG_TOKEN_MINT=<rig_mint>
OPERATOR_PRIVATE_KEY=<base58_key>
BUYBACK_MIN_DELAY_HOURS=2
BUYBACK_MAX_DELAY_HOURS=5
```

## License

MIT

## Contributing

This is a hackathon MVP. For production deployment, additional security audits and testing are required.
