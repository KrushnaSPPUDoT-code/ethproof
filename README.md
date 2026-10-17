# EthProof

**Sepolia Contract Address:** [0x1e6Bb2917698870D35134785A0f6E0149a59Ea84](https://sepolia.etherscan.io/address/0x1e6Bb2917698870D35134785A0f6E0149a59Ea84)

**Network:** Ethereum Sepolia Testnet  
**Chain ID:** 11155111  
**Deployment Transaction:** [View on Etherscan](https://sepolia.etherscan.io/tx/0x45ca0f86290e1ab8725d9f77e17cf93a5be03145732bd5d9fb46d9378c019421)

## Overview

EthProof is an Ethereum-based credential registry designed to help issue, verify, and revoke credentials associated with builders. It uses a Solidity smart contract deployed on the Sepolia test network.

## Features

- On-chain credential issuance
- Credential verification using a credential ID
- Authorized issuer management
- Credential revocation
- Ethereum wallet connectivity
- Smart-contract-based verification

## Technology Stack

- React and Vite
- Solidity
- Hardhat
- Ethers.js
- Ethereum Sepolia Testnet

## Smart Contract Functions

- `setIssuer(address, bool)` — manage authorized issuers.
- `issueCredential(address, string, bytes32)` — issue a credential with a builder address, credential type, and evidence hash.
- `verifyCredential(uint256)` — retrieve credential details and validity.
- `revokeCredential(uint256)` — revoke a credential.

## Run Locally

### Prerequisites

Install Node.js and npm, and have a compatible Ethereum wallet such as MetaMask.

### Setup

```bash
git clone https://github.com/KrushnaSPPUDoT-code/ethproof.git
cd ethproof
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Network

Use Ethereum Sepolia in your wallet.

- Chain ID: `11155111`
- Explorer: https://sepolia.etherscan.io/

The application is configured to use the deployed contract address listed above. Credential issuance requires an authorized issuer wallet. A connected wallet does not automatically have issuer permissions.

## Project Status

The smart contract is deployed on Sepolia. This is a testnet project intended for demonstration and development; testnet assets have no intended real-world monetary value.

## Future Improvements

- Expand credential types and verification workflows
- Improve issuer and holder experiences
- Add further automated tests
- Explore privacy-preserving evidence verification
- Deploy a publicly accessible demonstration

## Author

**Krushna Jagtap**  
S.Y. B.Sc. Blockchain Technology

[GitHub Repository](https://github.com/KrushnaSPPUDoT-code/ethproof)

---

Built for the EFDEVCON × SPPU Hackathon.
