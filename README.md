# Recibo

*Recibo turns a pasted invoice into a paid USDC transaction in under 60 seconds, with an on-chain NFT receipt and a Bitso → MXN off-ramp.*

**Sponsor Tracks:** Bitso Business · Ethereum Mexico · Arbitrum · SuperRare / Rare Protocol

Recibo is an AI-powered USDC payment gateway for LATAM freelancers, built for the **Ethereum Mexico 2026** hackathon. It streamlines the entire workflow from receiving a client email to off-ramping funds into a Mexican bank account.

## For Judges — 60-Second Verification
1. Open the live site: https://recibo-theta.vercel.app
2. Paste the sample invoice from `scripts/sample-invoice.json`
3. Open the generated link in a second browser, connect a wallet on Arbitrum Sepolia, pay in USDC
4. Confirm the `InvoicePaid` event on Arbiscan (link below)
5. Try paying the same invoice twice — second attempt reverts `AlreadyPaid` (idempotency)
6. View the RARE receipt NFT on Sepolia (link below)

## One Demo Path
1. **AI Parse:** Paste raw invoice text (email, PDF dump). Groq extracts metadata and amounts.
2. **Smart Link:** Generate a cryptographically encoded payment URL (no database).
3. **On-Chain Settlement:** Client pays in USDC on Arbitrum Sepolia.
4. **Verified Proof:** Real-time on-chain event detection and transaction receipts.
5. **Direct Off-Ramp:** Integrated instructions for withdrawing to MXN via Bitso.

## Tech Stack
- **AI:** Groq Cloud (Parsing & Data Extraction - llama-3.3-70b-versatile)
- **Blockchain:** Arbitrum Sepolia (USDC Payments)
- **Smart Contracts:** Solidity (OpenZeppelin standards)
- **Frontend:** Next.js 16, Tailwind CSS, Framer Motion
- **Web3:** Wagmi, Viem, RainbowKit
- **Fiat Integration:** Bitso API V3 (Optional balance preview)

## Trust & Security
- **Non-Custodial:** Funds go directly from the client's wallet to the freelancer's wallet.
- **Privacy First:** Invoice data is encoded in the URL and stored in local browser history. No central database.
- **Bitso Honest Mode:** Clearly distinguishes between on-chain payments and manual off-ramp steps.

## Submission Requirements

### Real Transaction Proofs (Arbitrum Sepolia)
*Note to judges: Use these hashes to verify contract interactions.*

1. **Approve USDC:** `[Pending Faucet Drop]`
2. **Pay Invoice:** `[Pending Faucet Drop]`
3. **RARE Mint:** `[Pending RARE Mint]`

**Contract Address:** [0x563249FfE1783050D95A2dc70fE549909b4D09a8](https://sepolia.arbiscan.io/address/0x563249FfE1783050D95A2dc70fE549909b4D09a8)
**Deployment Tx:** 0x0217eed43d9641f5255c032a544c0bffce7f6698448f1aa919a6929a8497cf61

## RARE Protocol Receipt (Sepolia)
- Collection: `0x58E482D6e8106d9aac12146dF728913D9585404e`
- Token ID: `[Pending RARE Mint]`
- Mint Tx: `[Pending RARE Mint]`
- View: `[Pending RARE Mint]`

## Team
- **Anand Vashishtha** ([@Anand-0037](https://github.com/Anand-0037)) — Smart contracts + AI parsing
- **Mansi Yadav** ([@Mansi2007275](https://github.com/Mansi2007275)) — Frontend + UX
- **Rohit** — Testing + on-chain proofs

## Local Development

1. **Setup Env:** Create `.env.local` with your API keys:
```env
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.3-70b-versatile
NEXT_PUBLIC_CONTRACT_ADDRESS=0x563249FfE1783050D95A2dc70fE549909b4D09a8
NEXT_PUBLIC_USDC_ADDRESS=0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL=your_arbitrum_sepolia_rpc_url
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional Bitso Preview
BITSO_API_KEY=
BITSO_API_SECRET=
BITSO_API_BASE_URL=https://stage.bitso.com
```

2. **Run:** `npm install && npm run dev`

## Deployment

```bash
# Compile
npm run compile

# Deploy to Arbitrum Sepolia
ARB_SEPOLIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc" \
DEPLOYER_PRIVATE_KEY="0x..." \
npm run deploy:arbitrum-sepolia
```
