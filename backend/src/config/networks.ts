export interface NetworkConfig {
  id: string;
  name: string;
  chainId: number;
  chainIdHex: string;
  rpcUrl: string;
  blockExplorerUrl: string;
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

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  'base-sepolia': {
    id: 'base-sepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    chainIdHex: '0x14A34',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorerUrl: 'https://sepolia-explorer.base.org',
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
    rpcUrl: process.env.ETH_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
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

export const getNetworkConfig = (networkId: string): NetworkConfig => {
  const config = SUPPORTED_NETWORKS[networkId];
  if (!config) {
    throw new Error(`Unsupported network: ${networkId}`);
  }
  return config;
};

export const getDefaultNetwork = (): NetworkConfig => {
  const defaultNetworkId = process.env.NETWORK_ID || 'base-sepolia';
  return getNetworkConfig(defaultNetworkId);
};

export const isValidNetwork = (networkId: string): boolean => {
  return networkId in SUPPORTED_NETWORKS;
};

export const getSupportedNetworkIds = (): string[] => {
  return Object.keys(SUPPORTED_NETWORKS);
};

export const getNetworkByChainId = (chainId: number): NetworkConfig | undefined => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.chainId === chainId);
};