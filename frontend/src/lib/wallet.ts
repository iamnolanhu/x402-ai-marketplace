export interface ChainConfig {
  id: string;
  name: string;
  chainId: number;
  chainIdHex: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  usdcAddress?: string;
  isTestnet: boolean;
  faucetUrls?: {
    native?: string;
    usdc?: string;
  };
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  'base-sepolia': {
    id: 'base-sepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    chainIdHex: '0x14A34',
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia-explorer.base.org'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    isTestnet: true,
    faucetUrls: {
      native: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet',
      usdc: 'https://faucet.circle.com/'
    }
  },
  'ethereum-sepolia': {
    id: 'ethereum-sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    chainIdHex: '0xAA36A7',
    rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    usdcAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    isTestnet: true,
    faucetUrls: {
      native: 'https://sepoliafaucet.com/',
      usdc: 'https://faucet.circle.com/'
    }
  }
};

export const getChainConfig = (chainId: string | number): ChainConfig | undefined => {
  if (typeof chainId === 'string') {
    return SUPPORTED_CHAINS[chainId];
  }
  return Object.values(SUPPORTED_CHAINS).find(chain => chain.chainId === chainId);
};

export const getDefaultChain = (): ChainConfig => {
  return SUPPORTED_CHAINS['base-sepolia'];
};

export const getSupportedChainIds = (): string[] => {
  return Object.keys(SUPPORTED_CHAINS);
};

export const isValidChain = (chainId: string | number): boolean => {
  return getChainConfig(chainId) !== undefined;
};

export interface WalletError extends Error {
  code?: number;
  data?: any;
}

export const WALLET_ERRORS = {
  USER_REJECTED_REQUEST: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
  CHAIN_NOT_ADDED: 4902,
};

export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatBalance = (balance: string, decimals: number = 6): string => {
  const num = parseFloat(balance);
  if (num === 0) return '0';
  if (num < 0.001) return '<0.001';
  return num.toFixed(decimals);
};