// User Activity Types
export interface UserActivity {
  address: string;
  transactionCount: number;
  nftCount: number;
  tradingVolume: string;
  activeDay: boolean;
  activeWeek: boolean;
  activeMonth: boolean;
  firstTransaction: number;
  lastTransaction: number;
  uniqueTokensTraded: number;
  uniqueCounterparties: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: number;
  blockNumber: number;
  gasUsed: string;
  gasPrice: string;
  methodId: string;
  functionName: string;
  isError: boolean;
  txreceipt_status: string;
}

export interface NFT {
  contractAddress: string;
  tokenId: string;
  name: string;
  symbol: string;
  tokenURI: string;
  owner: string;
  tokenName: string;
  image?: string;
}

export interface ActivityMetric {
  date: string;
  transactions: number;
  volume: string;
  activeAddresses: number;
  uniqueTokens: number;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
  label: string;
}

export interface DashboardData {
  summary: {
    totalTransactions: number;
    totalVolume: string;
    nftHoldings: number;
    averageGasSpent: string;
  };
  activityTimeline: TimeSeriesData[];
  topTokens: Array<{
    symbol: string;
    volume: string;
    transactions: number;
  }>;
  nftPortfolio: NFT[];
  recentTransactions: Transaction[];
}
