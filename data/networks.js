const dotenv = require('dotenv');

dotenv.config();

const chainId = new Map([
  ['mumbai', 80001],
  ['rinkeby', 4]
]);

const txUrl = new Map([
  ['mumbai', 'https://mumbai.polygonscan.com/tx'],
  ['rinkeby', 'https://rinkeby.etherscan.io/tx']
])

const apiUrls = new Map([
  ['mumbai', process.env.ALCHEMY_API_URL_MUMBAI],
  ['rinkeby', process.env.ALCHEMY_API_URL_RINKEBY]
])

module.exports = {
  chainId,
  txUrl,
  apiUrls
}