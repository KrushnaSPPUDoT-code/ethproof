import { useState } from 'react';
import './App.css';
import { connectEthProof } from './contract/ethproof';

const CONTRACT_ADDRESS = '0x1e6Bb2917698870D35134785A0f6E0149a59Ea84';

export default function App() {
  const [wallet, setWallet] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('Overview');
  const [chainInfo, setChainInfo] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [credentialId, setCredentialId] = useState('1');
  const [credential, setCredential] = useState(null);
  const [verifying, setVerifying] = useState(false);

  async function connectWallet() {
    setConnecting(true);
    setMessage('');

    try {
      const result = await connectEthProof();

      setWallet(result.address);
      setChainInfo({
        owner: result.owner,
        authorized: result.authorized,
        isOwner: result.isOwner,
      });

      setMessage(
        result.isOwner
          ? 'Connected to Sepolia. This wallet is the contract owner.'
          : result.authorized
            ? 'Connected to Sepolia. This wallet is an authorized issuer.'
            : 'Connected to Sepolia. This wallet can verify credentials but is not an issuer.'
      );
    } catch (error) {
      setMessage(error?.shortMessage || error?.message || 'Could not connect to EthProof.');
    } finally {
      setConnecting(false);
    }
  }

  async function verifyOnChain(event) {
    event.preventDefault();
    setVerifying(true);
    setCredential(null);
    setMessage('');

    try {
      if (!/^\d+$/.test(credentialId.trim())) {
        throw new Error('Enter a valid numeric credential ID.');
      }

      const { contract } = await connectEthProof();
      const id = BigInt(credentialId);
      const nextId = await contract.nextCredentialId();

      if (id < 1n || id >= nextId) {
        throw new Error(`Credential #${id} has not been issued on-chain.`);
      }

      const result = await contract.verifyCredential(id);

      const builder = result.builder ?? result[0];
      const issuer = result.issuer ?? result[1];
      const evidenceHash = result.evidenceHash ?? result[2];
      const credentialType = result.credentialType ?? result[3];
      const timestamp = result.timestamp ?? result[4];
      const revoked = result.revoked ?? result[5];
      const valid = result.valid ?? result[6];

      setCredential({
        id: credentialId,
        builder,
        issuer,
        evidenceHash,
        credentialType,
        timestamp: timestamp.toString(),
        revoked,
        valid,
      });
    } catch (error) {
      setMessage(
        error?.shortMessage ||
        error?.reason ||
        error?.message ||
        'Credential verification failed.'
      );
    } finally {
      setVerifying(false);
    }
  }

  const credentials = [
    { icon: '✦', category: 'COMMUNITY', title: 'Hackathon Builder', desc: 'Recognize participation and shipped projects.', color: 'violet' },
    { icon: '⌘', category: 'DEVELOPMENT', title: 'Open Source Contributor', desc: 'Celebrate contributions to public repositories.', color: 'blue' },
    { icon: '⬡', category: 'WEB3 SKILLS', title: 'Ethereum Explorer', desc: 'Showcase your journey building on Ethereum.', color: 'pink' }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">◆</span> ethproof<span className="brand-dot">.</span></div>
        <div className="side-label">WORKSPACE</div>
        {['Overview', 'My Credentials', 'Explore Builders'].map((item, i) => (
          <button key={item} className={`nav-item ${tab === item ? 'selected' : ''}`} onClick={() => setTab(item)}>
            <span>{['◈', '✧', '◎'][i]}</span>{item}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="network-pill"><span className="online-dot" /> Ethereum Sepolia</div>
          <p>Reputation you can verify.</p>
          <small>ETHPROOF · TESTNET DEMO</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {tab}</div>
          <button className="connect-button" onClick={connectWallet} disabled={connecting}>
            <span>◈</span>{' '}
            {connecting ? 'Connecting…' : wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect wallet'}
          </button>
        </header>

        {message && (
          <div className="notice">
            {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        <section className="hero">
          <div className="hero-text">
            <div className="eyebrow"><span>✦</span> YOUR WEB3 IDENTITY</div>
            <h1>Proof of work.<br /><span>Proof of trust.</span></h1>
            <p>Your achievements travel with you. Build a reputation that anyone can verify on Ethereum.</p>
            <button className="primary-button" onClick={() => setTab('My Credentials')}>Explore credentials <span>↗</span></button>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <div className="core">◆</div>
            <div className="floating-card"><span className="shield">✓</span><div><strong>Verifiable identity</strong><small>Built for Web3 builders</small></div></div>
            <div className="spark spark-one">✦</div><div className="spark spark-two">✧</div>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <h2>{tab === 'Overview' ? 'Your reputation, at a glance' : tab}</h2>
            <p>Achievements designed to follow you across the ecosystem.</p>
          </div>
          <span className="status-tag">SEPOLIA TESTNET</span>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Example credentials</span>
            <strong>03</strong>
            <small>Illustrative cards, not issued credentials</small>
          </div>
          <div className="stat-card">
            <span>Wallet status</span>
            <strong className="stat-word">{wallet ? 'Connected' : 'Guest'}</strong>
            <small>{wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect to get started'}</small>
          </div>
          <div className="stat-card">
            <span>Contract status</span>
            <strong className="stat-word">Deployed</strong>
            <small>Ethereum Sepolia · Chain ID 11155111</small>
          </div>
        </section>

        {chainInfo && (
          <section className="section-heading" style={{ marginTop: 24 }}>
            <div>
              <h2>Live issuer status</h2>
              <p>
                {chainInfo.isOwner
                  ? 'Connected wallet is the contract owner.'
                  : chainInfo.authorized
                    ? 'Connected wallet is an authorized issuer.'
                    : 'Connected wallet is read-only for credential issuance.'}
              </p>
              <p style={{ overflowWrap: 'anywhere' }}>Owner: {chainInfo.owner}</p>
            </div>
            <span className="status-tag">
              {chainInfo.isOwner || chainInfo.authorized ? 'ISSUER ACCESS' : 'VIEW ACCESS'}
            </span>
          </section>
        )}

        <section className="section-heading credentials-heading">
          <div>
            <h2><span className="heading-icon">✧</span> On-chain credential lookup</h2>
            <p>Enter a credential ID to read its verification result from the deployed contract.</p>
          </div>
          <a
            className="link-button"
            href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
          >
            View contract ↗
          </a>
        </section>

        <section className="stat-card" style={{ marginBottom: 24 }}>
          <form onSubmit={verifyOnChain}>
            <label htmlFor="credentialId">Credential ID</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              <input
                id="credentialId"
                type="number"
                min="1"
                step="1"
                value={credentialId}
                onChange={(event) => setCredentialId(event.target.value)}
                placeholder="Enter credential ID"
                required
                style={{ flex: '1 1 180px', minWidth: 0, padding: 12, borderRadius: 8, border: '1px solid #d5d5df' }}
              />
              <button className="primary-button" type="submit" disabled={verifying}>
                {verifying ? 'Verifying…' : 'Verify on-chain ↗'}
              </button>
            </div>
          </form>

          {credential && (
            <div style={{ marginTop: 20, overflowWrap: 'anywhere' }}>
              <h3>Credential #{credential.id}</h3>
              <p><strong>Validity:</strong> {credential.valid ? 'Valid' : 'Not valid'}</p>
              <p><strong>Revoked:</strong> {credential.revoked ? 'Yes' : 'No'}</p>
              <p><strong>Type:</strong> {credential.credentialType}</p>
              <p><strong>Builder:</strong> {credential.builder}</p>
              <p><strong>Issuer:</strong> {credential.issuer}</p>
              <p><strong>Evidence hash:</strong> {credential.evidenceHash}</p>
              <p><strong>Timestamp:</strong> {credential.timestamp}</p>
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                Inspect contract on Etherscan ↗
              </a>
            </div>
          )}
        </section>

        <section className="section-heading credentials-heading">
          <div>
            <h2><span className="heading-icon">✧</span> Featured credentials</h2>
            <p>These three cards are illustrative examples, not on-chain credentials.</p>
          </div>
          <button className="link-button" onClick={() => setTab('My Credentials')}>View all ↗</button>
        </section>

        {tab === 'Explore Builders' && <div className="notice">Builder discovery is planned for the next iteration.</div>}

        <section className="credential-grid">
          {credentials.map((c) => (
            <article className="credential-card" key={c.title}>
              <div className="credential-top"><div className={`credential-icon ${c.color}`}>{c.icon}</div><span className="demo-tag">DEMO</span></div>
              <div className="credential-category">{c.category}</div>
              <h3>{c.title}</h3><p>{c.desc}</p>
              <div className="credential-footer"><span>Example credential</span><span className="check-icon">✓</span></div>
            </article>
          ))}
        </section>

        <footer><strong>◆ ETHPROOF</strong><span>PORTABLE REPUTATION FOR BUILDERS</span><span>Prototype · Ethereum Sepolia</span></footer>
      </main>
    </div>
  );
}
