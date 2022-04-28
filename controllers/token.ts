import { Request, Response } from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

import verifyAddress from '../utils/verifyAddress';

import constants from '../data/constants';
import {
  chainId,
  txUrl,
  apiKeys,
  amount,
  ethersSupportedNetworkNames,
} from '../data/networks';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey as string);

const token = async (req: Request, res: Response) => {
  const address = wallet.address;

  const networkApiKey = apiKeys.get(String(req.query.network));

  const httpsProvider = new ethers.providers.AlchemyProvider(
    ethersSupportedNetworkNames.get(req.query.network as string),
    networkApiKey
  );

  let nonce = await httpsProvider.getTransactionCount(address, 'latest');

  let feeData = await httpsProvider.getFeeData();

  const balance = await httpsProvider
    .getBalance(constants['fromAddress'])
    .then((balance) => {
      return ethers.utils.formatEther(balance);
    });

  if (verifyAddress(req.query.address as string) === false) {
    res.json({
      error: 'Invalid receiver address',
      invalidAddress: true,
    });
  } else {
    if (balance < amount?.get(req.query.network as string)!) {
      res.json({
        error: 'Insufficient funds',
        insufficientFunds: true,
      });
    } else {
      const tx = {
        type: 2,
        nonce: nonce,
        to: req.query.address,
        maxPriorityFeePerGas: feeData['maxPriorityFeePerGas'],
        maxFeePerGas: feeData['maxFeePerGas'],
        value: ethers.utils.parseEther(
          amount.get(req.query.network as string) as string
        ),
        gasLimit: 30000,
        chainId: chainId.get(String(req.query.network)),
      };

      const signedTx = await wallet.signTransaction(tx as any);

      const txHash = ethers.utils.keccak256(signedTx);
      console.log('Precomputed txHash:', txHash);
      httpsProvider.sendTransaction(signedTx).then(console.log);

      res.json({
        txLink: `${txUrl.get(String(req.query.network))}/${txHash}`,
      });
    }
  }
};

export default token;
