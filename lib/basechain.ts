import axios from 'axios';
import { ethers } from 'ethers';
import { Transaction, UserActivity, NFT, ActivityMetric } from '@/types';

const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
const BASESCAN_API = 'https://api.basescan.org/api';
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

// Initialize provider
export const getProvider = () => {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
};

/**
 * Fetch all transactions for an address
 */
export const getTransactionsByAddress = async (
  address: string,
  page: number = 1,
  offset: number = 10000
): Promise<Transaction[]> => {
  try {
    const response = await axios.get(BASESCAN_API, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page,
        offset,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    if (response.data.status === '1') {
      return response.data.result || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

/**
 * Fetch internal transactions
 */
export const getInternalTransactions = async (
  address: string,
  page: number = 1,
  offset: number = 10000
): Promise<Transaction[]> => {
  try {
    const response = await axios.get(BASESCAN_API, {
      params: {
        module: 'account',
        action: 'txlistinternal',
        address,
        startblock: 0,
        endblock: 99999999,
        page,
        offset,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    if (response.data.status === '1') {
      return response.data.result || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching internal transactions:', error);
    return [];
  }
};

/**
 * Get ERC-20 token transfers
 */
export const getTokenTransfers = async (
  address: string,
  page: number = 1,
  offset: number = 10000
) => {
  try {
    const response = await axios.get(BASESCAN_API, {
      params: {
        module: 'account',
        action: 'tokentx',
        address,
        page,
        offset,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    if (response.data.status === '1') {
      return response.data.result || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching token transfers:', error);
    return [];
  }
};

/**
 * Get ERC-721 (NFT) transfers
 */
export const getNFTTransfers = async (
  address: string,
  page: number = 1,
  offset: number = 10000
) => {
  try {
    const response = await axios.get(BASESCAN_API, {
      params: {
        module: 'account',
        action: 'tokennfttx',
        address,
        page,
        offset,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    if (response.data.status === '1') {
      return response.data.result || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching NFT transfers:', error);
    return [];
  }
};

/**
 * Get account balance in ETH
 */
export const getBalance = async (address: string): Promise<string> => {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
};

/**
 * Calculate user activity metrics
 */
export const calculateUserActivity = async (
  address: string
): Promise<UserActivity> => {
  try {
    const [transactions, tokenTransfers, nftTransfers] = await Promise.all([
      getTransactionsByAddress(address),
      getTokenTransfers(address),
      getNFTTransfers(address),
    ]);

    // Calculate metrics
    const now = Math.floor(Date.now() / 1000);
    const dayAgo = now - 86400;
    const weekAgo = now - 604800;
    const monthAgo = now - 2592000;

    const activeDay = transactions.some(
      (tx) => parseInt(tx.timeStamp) > dayAgo
    );
    const activeWeek = transactions.some(
      (tx) => parseInt(tx.timeStamp) > weekAgo
    );
    const activeMonth = transactions.some(
      (tx) => parseInt(tx.timeStamp) > monthAgo
    );

    // Calculate trading volume
    const volume = transactions.reduce((sum, tx) => {
      return sum + (parseFloat(ethers.formatEther(tx.value || '0')) || 0);
    }, 0);

    // Unique tokens traded
    const uniqueTokens = new Set(tokenTransfers.map((tx) => tx.contractAddress))
      .size;

    // Unique counterparties
    const counterparties = new Set(
      transactions.map((tx) =>
        tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from
      )
    ).size;

    return {
      address,
      transactionCount: transactions.length,
      nftCount: new Set(nftTransfers.map((tx) => tx.tokenID)).size,
      tradingVolume: volume.toFixed(4),
      activeDay,
      activeWeek,
      activeMonth,
      firstTransaction: transactions.length
        ? Math.min(...transactions.map((tx) => parseInt(tx.timeStamp)))
        : 0,
      lastTransaction: transactions.length
        ? Math.max(...transactions.map((tx) => parseInt(tx.timeStamp)))
        : 0,
      uniqueTokensTraded: uniqueTokens,
      uniqueCounterparties: counterparties,
    };
  } catch (error) {
    console.error('Error calculating user activity:', error);
    throw error;
  }
};

/**
 * Get activity metrics for time period
 */
export const getActivityMetrics = async (
  address: string,
  days: number = 30
): Promise<ActivityMetric[]> => {
  try {
    const transactions = await getTransactionsByAddress(address);
    const tokenTransfers = await getTokenTransfers(address);

    const metrics: { [key: string]: ActivityMetric } = {};
    const now = Date.now();

    // Initialize metrics for each day
    for (let i = 0; i < days; i++) {
      const date = new Date(now - i * 86400000);
      const dateStr = date.toISOString().split('T')[0];
      metrics[dateStr] = {
        date: dateStr,
        transactions: 0,
        volume: '0',
        activeAddresses: 0,
        uniqueTokens: 0,
      };
    }

    // Process transactions
    transactions.forEach((tx) => {
      const date = new Date(parseInt(tx.timeStamp) * 1000);
      const dateStr = date.toISOString().split('T')[0];

      if (metrics[dateStr]) {
        metrics[dateStr].transactions++;
        const volume = parseFloat(ethers.formatEther(tx.value || '0')) || 0;
        metrics[dateStr].volume = (
          parseFloat(metrics[dateStr].volume) + volume
        ).toFixed(4);
        metrics[dateStr].activeAddresses++;
      }
    });

    return Object.values(metrics).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error getting activity metrics:', error);
    return [];
  }
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};
