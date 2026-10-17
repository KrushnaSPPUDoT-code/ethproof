import { BrowserProvider, Contract } from "ethers";
import abi from "./abi.json";
import {
  ETHPROOF_ADDRESS,
  ETHPROOF_CHAIN_ID,
} from "./config";

export async function connectEthProof() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const network = await provider.getNetwork();

  if (Number(network.chainId) !== ETHPROOF_CHAIN_ID) {
    throw new Error("Please switch MetaMask to Ethereum Sepolia.");
  }

  const signer = await provider.getSigner();
  const contract = new Contract(ETHPROOF_ADDRESS, abi, signer);

  return {
    provider,
    signer,
    contract,
    address: await signer.getAddress(),
  };
}
