import { useState } from 'react';
import './App.css';

export default function App() {
  const [wallet, setWallet] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('Overview');

  async function connectWallet() {
    if (!window.ethereum) {
      setMessage('MetaMask not found. Open this app in a browser with the MetaMask extension.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setWallet(accounts[0]);
      setMessage('Wallet connected successfully.');
    } catch (error) {
      setMessage(error?.message || 'Wallet connection cancelled.');
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
          <div className="network-pill"><span className="online-dot" /> Ethereum ecosystem</div>
          <p>Reputation you can verify.</p>
          <small>ETHPROOF · TESTNET DEMO</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {tab}</div>
          <button className="connect-button" onClick={connectWallet}>
            <span>◈</span> {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect wallet'}
          </button>
        </header>

        {message && <div className="notice">{message}<button onClick={() => setMessage('')}>×</button></div>}

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
          <div><h2>{tab === 'Overview' ? 'Your reputation, at a glance' : tab}</h2><p>Achievements designed to follow you across the ecosystem.</p></div>
          <span className="status-tag">PROTOTYPE</span>
        </section>

        <section className="stats-grid">
          <div className="stat-card"><span>Example credentials</span><strong>03</strong><small>Illustrative achievements</small></div>
          <div className="stat-card"><span>Wallet status</span><strong className="stat-word">{wallet ? 'Connected' : 'Guest'}</strong><small>{wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : 'Connect to get started'}</small></div>
          <div className="stat-card"><span>On-chain status</span><strong className="stat-word">Not deployed</strong><small>Smart contract integration next</small></div>
        </section>

        <section className="section-heading credentials-heading">
          <div><h2><span className="heading-icon">✧</span> Featured credentials</h2><p>Sample cards only — not yet issued or verified on-chain.</p></div>
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

        <footer><strong>◆ ETHPROOF</strong><span>PORTABLE REPUTATION FOR BUILDERS</span><span>Prototype · Ethereum</span></footer>
      </main>
    </div>
  );
}
