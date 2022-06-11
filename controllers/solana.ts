import { Request, Response } from "express";
import * as web3 from "@solana/web3.js";
import {
  amount,
  maxTokenLimit,
  solanaApiUrls,
  solanaSupportedNetworkNames,
  txUrl,
} from "../data/networks";

const solana = async (req: Request, res: Response) => {
  try {
    const network = req.query.network as string;

    // Validate if the client has sent the address
    if (!req.query.address) {
      return res.json({ error: "No address specified", invalidAddress: true });
    }

    // if invalid address
    if (!web3.PublicKey.isOnCurve(req.query.address)) {
      return res.json({
        error: "Invalid receiver address",
        invalidAddress: true,
      });
    }

    // if network is not devnet
    if (!solanaSupportedNetworkNames.get(network)) {
      return res.json({
        error: "Invalid or unsupported network",
        invalidNetwork: true,
      });
    }

    const connection = new web3.Connection(solanaApiUrls.get(network)!);
    const wallet = new web3.PublicKey(req.query.address);

    const balance = await connection.getBalance(wallet);
    const balanceSol = balance / web3.LAMPORTS_PER_SOL;

    if (balanceSol >= maxTokenLimit.get(network)!) {
      return res.json({
        error: "User balance exceeds the maximum limit",
        exceedsMaxLimit: true,
      });
    }

    const txHash = await connection.requestAirdrop(
      wallet,
      web3.LAMPORTS_PER_SOL * Number(amount.get(network))
    );

    return res.json({
      txLink: `${txUrl.get(network)}/${txHash}?cluster=devnet`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default solana;
