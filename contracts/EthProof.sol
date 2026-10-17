// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title EthProof
/// @notice On-chain registry for verifiable Web3 builder credentials.
/// @dev Store only hashes and public metadata here, never private evidence.
contract EthProof {
    address public owner;
    uint256 public nextCredentialId = 1;

    struct Credential {
        address builder;
        address issuer;
        bytes32 evidenceHash;
        string credentialType;
        uint64 issuedAt;
        bool revoked;
    }

    mapping(uint256 => Credential) private credentials;
    mapping(address => bool) public authorizedIssuers;

    event IssuerUpdated(address indexed issuer, bool authorized);

    event CredentialIssued(
        uint256 indexed credentialId,
        address indexed builder,
        address indexed issuer,
        string credentialType,
        bytes32 evidenceHash
    );

    event CredentialRevoked(
        uint256 indexed credentialId,
        address indexed issuer
    );

    error NotOwner();
    error NotAuthorizedIssuer();
    error InvalidAddress();
    error InvalidCredential();
    error AlreadyRevoked();
    error EmptyCredentialType();
    error EmptyEvidenceHash();

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
        emit IssuerUpdated(msg.sender, true);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyIssuer() {
        if (!authorizedIssuers[msg.sender]) revert NotAuthorizedIssuer();
        _;
    }

    function setIssuer(address issuer, bool authorized) external onlyOwner {
        if (issuer == address(0)) revert InvalidAddress();

        authorizedIssuers[issuer] = authorized;
        emit IssuerUpdated(issuer, authorized);
    }

    function issueCredential(
        address builder,
        string calldata credentialType,
        bytes32 evidenceHash
    ) external onlyIssuer returns (uint256 credentialId) {
        if (builder == address(0)) revert InvalidAddress();
        if (bytes(credentialType).length == 0) revert EmptyCredentialType();
        if (evidenceHash == bytes32(0)) revert EmptyEvidenceHash();

        credentialId = nextCredentialId++;

        credentials[credentialId] = Credential({
            builder: builder,
            issuer: msg.sender,
            evidenceHash: evidenceHash,
            credentialType: credentialType,
            issuedAt: uint64(block.timestamp),
            revoked: false
        });

        emit CredentialIssued(
            credentialId,
            builder,
            msg.sender,
            credentialType,
            evidenceHash
        );
    }

    function revokeCredential(uint256 credentialId) external {
        Credential storage credential = credentials[credentialId];

        if (credential.builder == address(0)) revert InvalidCredential();
        if (
            msg.sender != owner &&
            msg.sender != credential.issuer &&
            !authorizedIssuers[msg.sender]
        ) revert NotAuthorizedIssuer();
        if (credential.revoked) revert AlreadyRevoked();

        credential.revoked = true;
        emit CredentialRevoked(credentialId, msg.sender);
    }

    function verifyCredential(
        uint256 credentialId
    ) external view returns (
        address builder,
        address issuer,
        bytes32 evidenceHash,
        string memory credentialType,
        uint64 issuedAt,
        bool revoked,
        bool valid
    ) {
        Credential storage credential = credentials[credentialId];

        if (credential.builder == address(0)) {
            return (
                address(0),
                address(0),
                bytes32(0),
                "",
                0,
                false,
                false
            );
        }

        bool isValid =
            !credential.revoked &&
            authorizedIssuers[credential.issuer];

        return (
            credential.builder,
            credential.issuer,
            credential.evidenceHash,
            credential.credentialType,
            credential.issuedAt,
            credential.revoked,
            isValid
        );
    }
}
