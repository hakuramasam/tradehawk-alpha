export interface User {
  address: string
  siweNonce?: string
  thaiBalance?: number
}

export interface SessionData {
  address: string
  token: string
  expiresAt: number
  sessionKey?: string
  chainId: number
}

export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  chainId: number
  logoURI?: string
  price?: number
}

export interface TrendingToken {
  chainId: string
  tokenAddress: string
  symbol: string
  name: string
  priceUsd: string
  marketCap?: string
  volume24h?: string
  priceChange24h?: number
  liquidity?: string
  holders?: number
  url: string
  fdv?: string
  pairAddress?: string
}

export interface TradePreview {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  price: string
  priceImpact: string
  slippage: string
  route: string[]
  gasEstimate: string
  allowanceTarget?: string
}

export interface TradingStrategy {
  id: string
  name: string
  description: string
  enabled: boolean
  riskLevel: 'low' | 'medium' | 'high'
  maxPositionSize: number
  stopLoss: number
  takeProfit: number
  cooldownPeriod?: number
  conditions?: StrategyCondition[]
}

export interface StrategyCondition {
  type: 'price' | 'volume' | 'marketcap' | 'holders'
  operator: '>' | '<' | '==' | '>=' | '<='
  value: number
}

export interface AIAgentConfig {
  strategy: TradingStrategy
  autoMode: boolean
  sessionKeyEnabled: boolean
  maxDailyLoss: number
  maxOpenPositions: number
  tradingPairs: string[]
  slippage: number
}

export interface TransactionData {
  to: string
  from: string
  data: string
  value: string
  gas?: string
  gasPrice?: string
}

export interface SwapQuote {
  chainId: number
  price: string
  guaranteedPrice: string
  to: string
  data: string
  value: string
  gas: string
  estimatedGas: string
  gasPrice: string
  protocolFee: string
  minimumProtocolFee: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  orders: any[]
  sources: any[]
  allowanceTarget: string
  sellTokenToEthRate: string
  buyTokenToEthRate: string
  estimatedPriceImpact: string
  fees: any[]
}

export interface Position {
  id: string
  tokenAddress: string
  symbol: string
  entryPrice: number
  entryAmount: number
  currentPrice: number
  currentAmount: number
  currentValue: number
  pnl: number
  pnlPercentage: number
  createdAt: number
  strategyId: string
  stopLoss: number
  takeProfit: number
}

export interface TradeHistory {
  id: string
  tokenAddress: string
  symbol: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  executedAt: number
  txHash: string
  status: 'pending' | 'confirmed' | 'failed'
  strategyId: string
  pnl?: number
}

export interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  labels: string[]
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  price: {
    usd: string
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  volume: {
    h24: number
  }
  priceChange: {
    h1: number
    h24: number
    h6: number
  }
  txns: {
    h1: {
      buys: number
      sells: number
    }
    h24: {
      buys: number
      sells: number
    }
  }
  fdv: number
  marketCap: number
  holder: number
}

export interface DexScreenerResponse {
  pair: DexScreenerPair
  pairs: DexScreenerPair[]
}
