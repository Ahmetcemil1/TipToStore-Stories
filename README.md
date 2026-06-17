# 📚 TipToStore Stories

> **Community-funded decentralized publishing — stories that live or die by the community's support.**

[![FilecoinTLDR Builder Challenge](https://img.shields.io/badge/Hackathon-FilecoinTLDR_Builder_Challenge_2026-blue?style=flat-square)](https://tldr.filecoin.io/builder-challenge)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Filecoin](https://img.shields.io/badge/Filecoin-Calibration_Testnet-0090ff?style=flat-square)](https://filecoin.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 🎯 What is TipToStore?

TipToStore Stories is a **decentralized publishing platform** where authors write stories that are stored as Filecoin datasets. Reading is always free. But **storage isn't free** — community readers tip authors in **USDFC** (Filecoin's stablecoin), and each dollar of tips automatically extends the story's Filecoin storage lease.

**Stories that resonate with the community survive. Stories that don't, decay.**

This creates a powerful Web3-native economic model where:
- Filecoin is not just a "hard drive in the background" — it's the core economic engine
- Every tip is an on-chain transaction that extends a storage deal
- The survival of content is a transparent, algorithmic, decentralized market signal

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **📖 Free Reading** | Stories are always free to read via IPFS content addressing |
| **💸 USDFC Tipping** | Tip authors in USDFC; tips auto-extend Filecoin storage leases |
| **⛓️ Real Filecoin Deals** | Every story = a Filecoin Warm Storage dataset via Synapse SDK |
| **🔐 PDP Proofs** | Storage providers submit cryptographic proofs every epoch |
| **💀 Decay Mechanic** | Stories with no tips expire — decentralized natural selection |
| **🏆 Viral Rewards** | 10K+ likes triggers a 5 FIL network bonus to the author |
| **📷 Cover Images** | Authors upload cover photos (pinned to IPFS alongside content) |
| **📚 Multi-Chapter** | Stories can have multiple chapters with no length limit |
| **👤 Author Profiles** | Wallet-linked profiles with tip history and published stories |
| **🌈 MetaMask / WalletConnect** | Full wallet support via RainbowKit |

---

## 🛠️ Tech Stack

```
Frontend:   Next.js 16 + React 19 + TypeScript
Styling:    Tailwind CSS v4 (dark glassmorphism design)
Web3:       wagmi v2 + viem v2 + RainbowKit v2
Network:    Filecoin Calibration Testnet
Storage:    Synapse SDK (@filoz/synapse-sdk) — Warm Storage + PDP
Token:      USDFC (FRC-46 stablecoin) for tips
Wallets:    MetaMask, WalletConnect, Coinbase Wallet
```

---

## 🔑 Filecoin Integration (Why This Wins)

The Filecoin integration goes **beyond simple file storage**:

### 1. Storage-Funded-by-Tips Model
```
Author publishes story
  → Content pinned to IPFS (gets a CID)
  → Filecoin Warm Storage deal opened via Synapse SDK
  → Payment rail created with initial balance

Reader tips $5 USDFC
  → Transaction sent to author address on-chain
  → Protocol calculates: $5 / $0.12/mo ≈ +5 days storage
  → Filecoin deal end-epoch extended automatically
  → Storage providers continue submitting PDP proofs
```

### 2. Real Economic Incentives
- **Authors** earn USDFC directly from readers (no platform cut)
- **Storage Providers** earn FIL for hosting the data (Filecoin incentive)
- **Readers** pay only what they think the story is worth
- **Network** grows as popular content drives storage demand

### 3. Synapse SDK Usage
```typescript
// Upload story as Filecoin dataset
const ctx = await synapse.storage.createContext({ metadata: { title, author } });
const result = await ctx.upload(encodedContent);

// Tip + extend storage
await synapse.payments.topUpRail({ railId, amount: tipUSDFC });
await warmStorage.upsertDataSet(dataSetId, { endEpoch: newEndEpoch });
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask with Filecoin Calibration network
- USDFC tokens (get from [Filecoin Calibration Faucet](https://faucet.calibnet.chainsafe-fil.io))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/tipto-store.git
cd tipto-store

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables (Optional — for real Filecoin transactions)

```bash
# Create .env.local
NEXT_PUBLIC_AUTHOR_PRIVATE_KEY=0x...  # Only for server-side storage operations
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=3fbb6b16d4835a2cf82256c8d281d8ec
```

> **Note:** The app works fully in demo mode without env vars. Real Filecoin transactions require a funded Calibration testnet wallet.

### Build for Production

```bash
# ⚠️ Important: Build must be run from a path WITHOUT non-ASCII characters
# If your path contains Turkish/accented characters (e.g. "Masaüstü"), copy to a clean path first:
cp -r . /home/user/tipto-store && cd /home/user/tipto-store

npm run build
npm start
```

---

## 📁 Project Structure

```
tipto-store/
├── app/
│   ├── page.tsx                  # Main SPA coordinator (all routing)
│   ├── layout.tsx                # Root layout + SEO metadata
│   ├── globals.css               # Design system (glassmorphism, animations)
│   ├── providers.tsx             # wagmi + RainbowKit providers
│   │
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky navigation with wallet button
│   │   ├── StoryCard.tsx         # Story card with cover, storage bar
│   │   ├── StoryDetailView.tsx   # Full story reader with chapters
│   │   ├── WriteView.tsx         # Publish story (cover + content + tags)
│   │   ├── AboutView.tsx         # How it works + tech stack page
│   │   ├── AuthorView.tsx        # Author profile + tip history
│   │   ├── StatsBar.tsx          # Global platform stats
│   │   ├── TipModal.tsx          # Tip & extend storage modal
│   │   └── Toast.tsx             # Notification toast
│   │
│   ├── lib/
│   │   └── data.ts               # Seed stories with rich content
│   │
│   ├── services/
│   │   └── filecoin.ts           # Synapse SDK integration
│   │
│   └── types/
│       └── index.ts              # Shared TypeScript types
│
├── next.config.ts
├── package.json
└── README.md
```

---

## 🎨 Design Philosophy

The UI uses a **premium dark glassmorphism** aesthetic:
- Deep space color palette (`#020810` background)
- Emerald + sky blue accent gradient
- Backdrop blur glass cards with subtle borders
- Smooth CSS animations (fadeInUp, pulse-glow, float)
- Fully responsive — mobile to 4K

---

## 📊 Judging Criteria Coverage

| Criterion | Weight | Our Approach |
|---|---|---|
| **Filecoin Meaningful Use** | 30% | Storage-deals-as-economy: tips = storage extension. Not just "upload a file." |
| **Technical Implementation** | 20% | Synapse SDK, wagmi/viem, RainbowKit, TypeScript, Next.js 16 |
| **Creativity & Innovation** | 20% | First "tip-to-survive" publishing economy on Filecoin |
| **Demo Quality** | 15% | Full working demo with real wallet connect, seed stories, all features |
| **Documentation & Clarity** | 15% | This README + in-app About page explaining every mechanic |

---

## 🌐 Live Demo

Run locally with `npm run dev` and navigate to:

- **`/`** — Story feed with filter/search/sort
- **About tab** — Full explanation of how it works
- **Publish tab** — Write and publish a story (wallet required)
- **Click any story** — Full reader with chapter navigation
- **Click any author** — Profile with stats and tip history
- **Tip any story** — Modal with preset amounts and storage preview

---

## 🔗 Resources

- [Filecoin Calibration Faucet](https://faucet.calibnet.chainsafe-fil.io)
- [Synapse SDK Docs](https://github.com/filoz/synapse-sdk)
- [USDFC Token Info](https://docs.filecoin.io/smart-contracts/defi/usdfc)
- [FilecoinTLDR Builder Challenge](https://tldr.filecoin.io/builder-challenge)

---

## 📄 License

MIT — Built for FilecoinTLDR Builder Challenge 2026
