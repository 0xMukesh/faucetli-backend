import dotenv from 'dotenv';

dotenv.config();

const chainId = new Map([
  ['mumbai', 80001],
  ['rinkeby', 4],
]);

const txUrl = new Map([
  ['mumbai', 'https://mumbai.polygonscan.com/tx'],
  ['rinkeby', 'https://rinkeby.etherscan.io/tx'],
]);

const apiKeys = new Map([
  ['mumbai', process.env.ALCHEMY_API_KEY_MUMBAI],
  ['rinkeby', process.env.ALCHEMY_API_KEY_RINKEBY],
]);

const httpsUrls = new Map([
  [
    'mumbai',
    'https://polygon-mumbai.g.alchemy.com/v2/' +
      process.env.ALCHEMY_API_KEY_MUMBAI,
  ],
  [
    'rinkeby',
    'https://eth-rinkeby.alchemyapi.io/v2/' +
      process.env.ALCHEMY_API_KEY_RINKEBY,
  ],
]);

const ethersSupportedNetworkNames = new Map([
  ['mumbai', 'maticmum'],
  ['rinkeby', 'rinkeby'],
]);

const amount = new Map([
  ['mumbai', '1'],
  ['rinkeby', '0.1'],
]);

export {
  chainId,
  txUrl,
  apiKeys,
  httpsUrls,
  amount,
  ethersSupportedNetworkNames,
};
