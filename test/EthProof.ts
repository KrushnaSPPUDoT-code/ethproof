import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { keccak256, toBytes, zeroAddress } from "viem";

describe("EthProof", async function () {
  const { viem } = await network.connect();

  async function deployFixture() {
    const publicClient = await viem.getPublicClient();
    const [owner, builder, other, issuer] = await viem.getWalletClients();
    const contract = await viem.deployContract("EthProof");

    return { publicClient, owner, builder, other, issuer, contract };
  }

  it("sets the deployer as owner and an authorized issuer", async function () {
    const { owner, contract } = await deployFixture();

    assert.equal((await contract.read.owner()).toLowerCase(), owner.account.address.toLowerCase());
    assert.equal(
      await contract.read.authorizedIssuers([owner.account.address]),
      true
    );
  });

  it("issues a credential that can be verified", async function () {
    const { publicClient, owner, builder, contract } = await deployFixture();
    const evidenceHash = keccak256(toBytes("demo-builder-evidence"));

    const hash = await contract.write.issueCredential([
      builder.account.address,
      "Hackathon Winner",
      evidenceHash,
    ]);
    await publicClient.waitForTransactionReceipt({ hash });

    const credential = await contract.read.verifyCredential([1n]);

    assert.equal(credential[0].toLowerCase(), builder.account.address.toLowerCase());
    assert.equal(credential[1].toLowerCase(), owner.account.address.toLowerCase());
    assert.equal(credential[2], evidenceHash);
    assert.equal(credential[3], "Hackathon Winner");
    assert.equal(credential[5], false);
    assert.equal(credential[6], true);
  });

  it("rejects credential issuance from an unauthorized account", async function () {
    const { builder, other, contract } = await deployFixture();

    const unauthorizedContract = await viem.getContractAt(
      "EthProof",
      contract.address,
      { client: { wallet: other } }
    );

    await assert.rejects(
      unauthorizedContract.write.issueCredential([
        builder.account.address,
        "Contributor",
        keccak256(toBytes("evidence")),
      ])
    );
  });

  it("allows the owner to authorize another issuer", async function () {
    const { publicClient, issuer, contract } = await deployFixture();

    const hash = await contract.write.setIssuer([issuer.account.address, true]);
    await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(
      await contract.read.authorizedIssuers([issuer.account.address]),
      true
    );
  });

  it("marks a revoked credential as invalid", async function () {
    const { publicClient, builder, contract } = await deployFixture();

    const issueHash = await contract.write.issueCredential([
      builder.account.address,
      "Contributor",
      keccak256(toBytes("contribution-evidence")),
    ]);
    await publicClient.waitForTransactionReceipt({ hash: issueHash });

    const revokeHash = await contract.write.revokeCredential([1n]);
    await publicClient.waitForTransactionReceipt({ hash: revokeHash });

    const credential = await contract.read.verifyCredential([1n]);

    assert.equal(credential[5], true);
    assert.equal(credential[6], false);
  });

  it("returns invalid for a credential that does not exist", async function () {
    const { contract } = await deployFixture();

    const credential = await contract.read.verifyCredential([999n]);

    assert.equal(credential[0].toLowerCase(), zeroAddress.toLowerCase());
    assert.equal(credential[6], false);
  });
});
