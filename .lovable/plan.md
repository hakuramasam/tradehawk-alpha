# TradeHawk AI — $THAI Gated Agent on Base

## Scope

Pivot the existing landing page into a real product:

1. Marketing site rebranded around $THAI on Base mainnet (Clanker token at `0x00c605b6515A8509974391FCFd34014c78107B07`).
2. Web3 wallet auth via RainbowKit + wagmi + viem on Base mainnet.
3. Token gate: wallet must hold ≥ **100,000 $THAI** to enter the agent dashboard.
4. AI Agent dashboard: scans trending Base alpha tokens, proposes/executes trades using autonomous strategies.

## Important honesty up front

"Fully autonomous on-chain trading" with a user's connected wallet has hard constraints — a connected browser wallet (MetaMask/Rainbow) **must sign every transaction**. True 24/7 autonomy requires either (a) a session/delegated key (e.g. a separate hot wallet the agent controls), or (b) a smart-account / session-key setup. I will build the safe, achievable version:

- **Mode A — Signal mode (default, on by launch):** Agent monitors Base trending tokens 24/7, runs strategies, surfaces ranked trade signals with entry/SL/TP. User clicks "Execute" → wallet signs a Uniswap/0x swap on Base.
- **Mode B — Auto-execute (opt-in, scaffolded):** User generates a session key (burner wallet) in-app, funds it, sets risk caps (max per trade, max daily, allowed tokens). Agent executes within caps. Shipped as UI + backend skeleton; the actual session-key signing flow is stubbed behind a feature flag because it needs careful audit before going live with real funds.

This is the responsible scope. Real money is involved.

## Architecture

```text
Browser (React + RainbowKit/wagmi)
  ├─ Public site (/, /lore, /tokenomics, /faq)
  ├─ /connect      → wallet connect + $THAI balance check on Base
  └─ /app          → gated dashboard
        ├─ Trending Base tokens (live)
        ├─ Agent signals (strategy outputs)
        ├─ Execute trade (0x swap, user signs)
        ├─ Positions & PnL
        └─ Auto-mode settings (session key, risk caps)

Lovable Cloud (Supabase)
  ├─ auth: SIWE (Sign-In With Ethereum) → Supabase session
  ├─ tables: users, wallets, sessions, signals, trades,
  │          positions, agent_runs, risk_settings
  └─ edge functions:
      ├─ siwe-nonce / siwe-verify       (auth)
      ├─ verify-thai-balance            (server-side gate)
      ├─ trending-base-tokens           (DexScreener/GeckoTerminal)
      ├─ agent-scan (cron, every 1–5m)  (run strategies, write signals)
      ├─ swap-quote                     (0x API quote for Base)
      └─ execute-auto-trade             (Mode B, behind flag)
```

## Phases

**Phase 1 — Rebrand + wallet gate (this PR)**
- New copy/branding: TradeHawk AI / $THAI / Base, link to Clanker, copyable CA.
- Install `wagmi`, `viem`, `@rainbow-me/rainbowkit`, `@tanstack/react-query` (already present).
- Configure Base mainnet, WalletConnect projectId (secret).
- `useThaiBalance(address)` hook → `balanceOf` on `0x00c6…7B07`.
- `/app` route guarded: if balance < 100k $THAI → "Acquire $THAI" CTA → Clanker link.
- Skeleton dashboard with placeholder signal/positions panels.

**Phase 2 — Backend + SIWE + live data**
- Enable Lovable Cloud.
- SIWE auth edge functions, link wallet → Supabase user.
- Server-side $THAI balance re-check on every protected call (don't trust client).
- Trending tokens edge function via DexScreener public API (Base chain).
- Persist user risk settings.

**Phase 3 — Strategies + signals**
- Implement 2–3 baseline strategies: momentum breakout, volume spike + liquidity filter, smart-money wallet copy.
- Cron edge function writes ranked signals.
- Dashboard renders live signals with reasoning, confidence, entry/SL/TP.

**Phase 4 — Execution (Mode A)**
- 0x Swap API integration on Base; user signs swap via connected wallet.
- Record trades + positions; PnL from on-chain reads.

**Phase 5 — Auto-execute (Mode B, behind feature flag)**
- Session key generation, encrypted storage, risk caps UI.
- Background worker (cron) executes within caps. Manual kill switch.
- **Not enabled by default; requires explicit user opt-in + audit pass.**

## Secrets required

- `WALLETCONNECT_PROJECT_ID` (public, OK in code) — I'll ask for it via secret prompt to keep it tidy.
- `ZEROX_API_KEY` (Phase 4).
- `ALCHEMY_BASE_RPC_URL` or similar (Phase 2+, for reliable Base reads).

## Out of scope / risks

- No CEX integration, no leverage, no perps.
- No financial advice; clear disclaimers throughout.
- Mode B will ship as scaffolding, not enabled, until reviewed.

## This turn

I'll execute **Phase 1** end-to-end: rebrand site to $THAI/Base, install RainbowKit stack, add wallet connect, add $THAI balance gate, and add a gated `/app` dashboard skeleton. Phases 2–5 follow in subsequent turns once you confirm.

Confirm to proceed with Phase 1.