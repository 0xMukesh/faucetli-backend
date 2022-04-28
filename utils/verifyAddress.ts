import ethers from 'ethers';

const verifyAddress = (address: string) => {
  try {
    ethers.utils.getAddress(address);
  } catch {
    return false;
  }
  return true;
};

export default verifyAddress;
