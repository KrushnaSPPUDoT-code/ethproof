import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EthProofModule = buildModule("EthProofModule", (m) => {
  const ethProof = m.contract("EthProof");

  return { ethProof };
});

export default EthProofModule;
