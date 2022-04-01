const ethers = require("ethers");
const dotenv = require("dotenv");
const web3 = require("web3");

dotenv.config();

const { chainId, txUrl, apiUrls } = require("../data/networks");

const privateKey = process.env.PRIVATE_KEY.toString();
const wallet = new ethers.Wallet(privateKey);

const token = async (req, res) => {
  if (web3.utils.isAddress(req.query.address) === false) {
    res.json({
      error: "Invalid receiver address",
    });
  } else {
    const address = wallet.address;

    const httpsUrl = apiUrls.get(req.query.network);

    const httpsProvider = new ethers.getDefaultProvider(httpsUrl);

    let nonce = await httpsProvider.getTransactionCount(address);

    let feeData = await httpsProvider.getFeeData();

    const tx = {
      type: 2,
      nonce: nonce,
      to: req.query.address,
      maxPriorityFeePerGas: feeData["maxPriorityFeePerGas"],
      maxFeePerGas: feeData["maxFeePerGas"],
      value: ethers.utils.parseEther("0.1"),
      gasLimit: "696969",
      chainId: chainId.get(req.query.network),
    };

    const signedTx = await wallet.signTransaction(tx);

    const txHash = ethers.utils.keccak256(signedTx);
    console.log("Precomputed txHash:", txHash);
    httpsProvider.sendTransaction(signedTx).then(console.log);

    await res.json({
      txLink: `${txUrl.get(req.query.network)}/${txHash}`,
    });
  }
};

module.exports = token;
