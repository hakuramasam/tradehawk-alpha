import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http } from "wagmi";

// Replace VITE_WALLETCONNECT_PROJECT_ID with your real WalletConnect Cloud projectId.
// Without it, WalletConnect-based wallets (mobile QR) won't work; injected wallets still will.
const projectId =
  (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined) ||
  "TRADEHAWK_PLACEHOLDER_PROJECT_ID";

export const wagmiConfig = getDefaultConfig({
  appName: "TradeHawk AI",
  projectId,
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  ssr: false,
});