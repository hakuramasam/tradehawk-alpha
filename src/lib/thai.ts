export const THAI_CONTRACT_ADDRESS =
  "0x00c605b6515A8509974391FCFd34014c78107B07" as const;

export const THAI_DECIMALS = 18;
export const THAI_SYMBOL = "$THAI";
export const THAI_NAME = "TradeHawk AI";

// Minimum $THAI required to access the AI Agent dashboard.
export const THAI_MIN_HOLDING = 100_000n;

export const CLANKER_URL =
  "https://www.clanker.world/clanker/0x00c605b6515A8509974391FCFd34014c78107B07";

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;