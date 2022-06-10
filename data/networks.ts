import dotenv from "dotenv";

dotenv.config();

const chainId = new Map([
  ["mumbai", 80001],
  ["rinkeby", 4],
]);

const txUrl = new Map([
  ["mumbai", "https://mumbai.polygonscan.com/tx"],
  ["rinkeby", "https://rinkeby.etherscan.io/tx"],
  ["devnet", "https://explorer.solana.com/tx"],
]);

const apiKeys = new Map([
  ["mumbai", process.env.ALCHEMY_API_KEY_MUMBAI],
  ["rinkeby", process.env.ALCHEMY_API_KEY_RINKEBY],
]);

const ethersSupportedNetworkNames = new Map([
  ["mumbai", "maticmum"],
  ["rinkeby", "rinkeby"],
]);

const solanaSupportedNetworkNames = new Map([["devnet", "devnet"]]);

const amount = new Map([
  ["mumbai", "1"],
  ["rinkeby", "0.1"],
  ["devnet", "1"],
]);

const maxTokenLimit = new Map<string, number>([
  ["mumbai", 5],
  ["rinkeby", 1],
  ["devnet", 5],
]);

export {
  chainId,
  txUrl,
  apiKeys,
  amount,
  ethersSupportedNetworkNames,
  solanaSupportedNetworkNames,
  maxTokenLimit,
};
