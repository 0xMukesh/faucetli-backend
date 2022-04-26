import { Request, Response } from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import Web3 from 'web3';

import constants from '../data/constants';
import {
  chainId,
  txUrl,
  apiKeys,
  httpsUrls,
  amount,
  ethersSupportedNetworkNames,
} from '../data/networks';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY!.toString();
const wallet = new ethers.Wallet(privateKey);

const token = async (req: Request, res: Response) => {
  const address = wallet.address;

  const networkApiKey = apiKeys.get(String(req.query.network));
  const networkHttpsUrl = httpsUrls.get(String(req.query.network));

  var web3 = new Web3(
    new Web3.providers.HttpProvider(networkHttpsUrl as string)
  );

  const httpsProvider = new ethers.providers.AlchemyProvider(
    ethersSupportedNetworkNames.get(req.query.network as string),
    networkApiKey
  );

  let nonce = await httpsProvider.getTransactionCount(address, 'latest');

  let feeData = await httpsProvider.getFeeData();

  const balance = web3.utils.fromWei(
    await web3.eth.getBalance(constants['fromAddress']),
    'ether'
  );

  if (web3.utils.isAddress(String(req.query.address!)) === false) {
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
