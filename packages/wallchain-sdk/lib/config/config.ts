import { getEnv } from "./utils";

// Network chain ids
export const CHAIN_ID = {
  BSC: 56,
  BSC_TESTNET: 97,
  MATIC: 137,
  //   MATIC_TESTNET: 80001,
  ETH: 1,
} as const;

export type CHAIN_NAMES = keyof typeof CHAIN_ID;
export type CHAIN_IDS = typeof CHAIN_ID[CHAIN_NAMES];

// Wallchain Configs
const WALLCHAIN_PARAMS: Record<
  CHAIN_IDS,
  { apiUrl: string; apiKey: () => string }
> = {
  [CHAIN_ID.BSC]: {
    apiUrl: "https://bsc.wallchains.com/upgrade_txn/",
    apiKey: () => getEnv("API_KEY_BSC", true),
  },
  [CHAIN_ID.BSC_TESTNET]: {
    apiUrl: "https://bsc.wallchains.com/upgrade_txn/",
    apiKey: () => getEnv("API_KEY_BSC_TESTNET", true),
  },
  [CHAIN_ID.MATIC]: {
    apiUrl: "https://matic.wallchains.com/upgrade_txn/",
    apiKey: () => getEnv("API_KEY_MATIC", true),
  },
  [CHAIN_ID.ETH]: {
    apiUrl: "",
    apiKey: () => getEnv("API_KEY_ETH", true),
  },
};

export function getWallchainAPIUrl(chainId: CHAIN_IDS) {
  const { apiUrl, apiKey } = WALLCHAIN_PARAMS[chainId];
  return `${apiUrl}?key=${apiKey()}`;
}
