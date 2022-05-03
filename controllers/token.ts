import { Request, Response } from "express";
import { ethers, utils, BigNumber } from "ethers";
import dotenv from "dotenv";

import verifyAddress from "../utils/verifyAddress";

import constants from "../data/constants";
import {
  chainId,
  txUrl,
  apiKeys,
  amount,
  ethersSupportedNetworkNames,
  maxTokenLimit,
} from "../data/networks";

dotenv.config();

const token = async (req: Request, res: Response) => {
  try {
    // Validate if the client has sent the address
    if (!req.query.address) {
      return res
        .status(400)
        .json({ error: "No address specified", invalidAddress: true });
    }

    if (!ethersSupportedNetworkNames.get(req.query.network as string)) {
      return res.status(400).json({
        error: "Invalid or unsupported network",
        invalidNetwork: true,
      });
    }

    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey as string);
    const address = wallet.address;

    const networkApiKey = apiKeys.get(String(req.query.network));

    const httpsProvider = new ethers.providers.AlchemyProvider(
      ethersSupportedNetworkNames.get(req.query.network as string),
      networkApiKey
    );

    const userBalance: BigNumber = await httpsProvider.getBalance(
      req.query.address as string
    );

    const userBalanceParsed: number = parseInt(userBalance.toString()) / 1e18;

    console.log(userBalanceParsed);

    if (userBalanceParsed > maxTokenLimit.get(req.query.network as string)!) {
      return res.status(400).json({
        error: "User balance exceeds the maximum limit",
        exceedsMaxLimit: true,
      });
    }

    let nonce = await httpsProvider.getTransactionCount(address, "latest");

    let feeData = await httpsProvider.getFeeData();

    const balance = await httpsProvider
      .getBalance(constants["fromAddress"])
      .then((balance) => {
        return utils.formatEther(balance);
      });

    if (verifyAddress(req.query.address as string) === false) {
      return res.status(400).json({
        error: "Invalid receiver address",
        invalidAddress: true,
      });
    } else {
      if (balance < amount?.get(req.query.network as string)!) {
        return res.status(400).json({
          error: "Insufficient funds",
          insufficientFunds: true,
        });
      } else {
        const tx = {
          type: 2,
          nonce: nonce,
          to: req.query.address as string,
          maxPriorityFeePerGas: feeData["maxPriorityFeePerGas"],
          maxFeePerGas: feeData["maxFeePerGas"],
          value: utils.parseEther(
            amount.get(req.query.network as string) as string
          ),
          gasLimit: 30000,
          chainId: chainId.get(req.query.network as string),
        };

        const signedTx = await wallet.signTransaction(tx as any);

        const txHash = utils.keccak256(signedTx);
        console.log("Precomputed txHash:", txHash);
        httpsProvider.sendTransaction(signedTx).then(console.log);

        return res.json({
          txLink: `${txUrl.get(String(req.query.network))}/${txHash}`,
        });
      }
    }
  } catch (err) {
    console.error("[ERR] in token.ts request part\n", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default token;
