// frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import GameCanvas from './components/GameCanvas';

export default function App() {
  const [activeView, setActiveView] = useState('home');

  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  const [currentWave, setCurrentWave] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [wavesClearedCount, setWavesClearedCount] = useState(0);

  const [finalScore, setFinalScore] = useState(0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('bb_coins')) || 150);
  const [lives, setLives] = useState(3);
  const [gameKey, setGameKey] = useState(0);
  const [activeBooster, setActiveBooster] = useState(null);

  const hasLoggedResultRef = useRef(false);

  const [leaderboardTab, setLeaderboardTab] = useState('Global');

  // Game History State
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem('bb_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Global High Scores for Leaderboard (Top 20)
  const [globalScores, setGlobalScores] = useState(() => {
    const saved = localStorage.getItem('bb_global_leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  // User Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bb_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Game Over Score Submission Form State (for guests)
  const [gameOverNameInput, setGameOverNameInput] = useState('');
  const [gameOverEmailInput, setGameOverEmailInput] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Sound Persistence
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('brick_breaker_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('bb_coins', coins);
    localStorage.setItem('bb_history', JSON.stringify(gameHistory));
    localStorage.setItem('bb_global_leaderboard', JSON.stringify(globalScores));
  }, [coins, gameHistory, globalScores]);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('brick_breaker_sound', JSON.stringify(newState));
  };

  const handleStartGame = () => {
    setCurrentWave(1);
    setGameOver(false);
    setLevelCleared(false);
    setLives(3);
    setTotalScore(0);
    setSessionCoins(0);
    setWavesClearedCount(0);
    setIsPaused(false);
    setScoreSubmitted(false);
    setGameOverNameInput('');
    setGameOverEmailInput('');
    hasLoggedResultRef.current = false;
    setGameKey((prev) => prev + 1);
    setActiveView('play');
  };

  const handleGameOver = (score) => {
    if (hasLoggedResultRef.current) return;
    hasLoggedResultRef.current = true;

    setFinalScore(score);
    const endRunCoins = Math.floor(score / 20);
    const totalRunCoins = sessionCoins + endRunCoins;
    setCoins((c) => c + endRunCoins);

    // If user is already logged in, automatically save and submit score
    if (user) {
      saveAndPublishScore(user.name, user.email, score, totalRunCoins, currentWave);
      setScoreSubmitted(true);
    }

    setGameOver(true);
  };

  const saveAndPublishScore = (playerName, playerEmail, score, totalRunCoins, maxWave) => {
    const sessionEntry = {
      id: Date.now(),
      playerName,
      playerEmail,
      maxWave,
      score,
      totalCoins: totalRunCoins,
      date: new Date().toLocaleDateString()
    };

    setGameHistory((prev) => {
      const updated = [sessionEntry, ...prev];
      return updated.sort((a, b) => b.score - a.score);
    });

    setGlobalScores((prev) => {
      const updated = [...prev, { name: playerName, score, coins: totalRunCoins, waves: maxWave }];
      return updated.sort((a, b) => b.score - a.score).slice(0, 20); // Top 20 high scores
    });
  };

  const handleGameOverScoreSubmit = (e) => {
    e.preventDefault();
    if (!gameOverNameInput.trim() || !gameOverEmailInput.trim()) return;

    const playerName = gameOverNameInput.trim();
    const playerEmail = gameOverEmailInput.trim();
    const endRunCoins = Math.floor(finalScore / 20);
    const totalRunCoins = sessionCoins + endRunCoins;

    // Save user to session if not logged in
    const userData = { email: playerEmail, name: playerName };
    setUser(userData);
    localStorage.setItem('bb_user', JSON.stringify(userData));

    saveAndPublishScore(playerName, playerEmail, finalScore, totalRunCoins, currentWave);
    setScoreSubmitted(true);
  };

  const handleWaveClear = (score) => {
    setFinalScore(score);
    setTotalScore(score);
    const waveCoins = 30;
    setSessionCoins((c) => c + waveCoins);
    setCoins((c) => c + waveCoins);
    setWavesClearedCount((c) => c + 1);
    
    setCurrentWave((w) => w + 1);
    setLevelCleared(true);
  };

  const handleNextWave = () => {
    setLevelCleared(false);
    setGameKey((prev) => prev + 1);
  };

  const handleRestart = () => {
    handleStartGame();
  };

  const handleActivateBooster = (type, cost) => {
    if (coins >= cost) {
      setCoins((c) => c - cost);
      setActiveBooster(type);
    } else {
      alert('Not enough coins! Play more games to earn coins.');
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !nameInput.trim() || passwordInput.length < 6) return;
    const userData = { email: emailInput.trim(), name: nameInput.trim() };
    setUser(userData);
    localStorage.setItem('bb_user', JSON.stringify(userData));
    setEmailInput('');
    setNameInput('');
    setPasswordInput('');
    setActiveView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bb_user');
  };

  return (
    <div style={appContainerStyle}>
      <style>{`
        .bb-nav-pill { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .bb-nav-pill:hover { background: rgba(56, 189, 248, 0.2) !important; color: #ffffff !important; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.25); }
        .bb-tactile-btn { transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease, box-shadow 0.15s ease; cursor: pointer; }
        .bb-tactile-btn:hover { transform: translateY(-4px); filter: brightness(1.12); box-shadow: 0 8px 25px rgba(245, 158, 11, 0.45); }
        .bb-tactile-btn:active { transform: translateY(2px); }
        .bb-card-hover { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .bb-card-hover:hover { transform: translateY(-4px); border-color: rgba(56, 189, 248, 0.7) !important; box-shadow: 0 10px 30px rgba(56, 189, 248, 0.25); }
      `}</style>

      {/* Top Professional Navbar */}
      <header style={headerWrapperStyle}>
        <div style={topBrandRowStyle}>
          <div className="bb-nav-pill" style={brandIdentityStyle} onClick={() => setActiveView('home')}>
            <div style={brandOrbIconStyle}>🧱</div>
            <span style={brandNameStyle}>BRICKS BREAKER</span>
          </div>

          <div style={utilityPillsStyle}>
            <div style={coinDisplayStyle}>
              🪙 <span style={{ color: '#fbbf24', fontWeight: '800' }}>{coins}</span>
            </div>
            <button className="bb-nav-pill" onClick={handleToggleSound} style={miniIconBtnStyle} title="Toggle Audio">
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        <nav style={navPillsContainerStyle}>
          <button className="bb-nav-pill" onClick={() => setActiveView('home')} style={getNavPillStyle(activeView === 'home')}>Home</button>
          <button className="bb-nav-pill" onClick={() => setActiveView('leaderboard')} style={getNavPillStyle(activeView === 'leaderboard')}>Leaderboard</button>
          <button className="bb-nav-pill" onClick={() => setActiveView('history')} style={getNavPillStyle(activeView === 'history')}>History</button>
          <button className="bb-nav-pill" onClick={() => setActiveView('login')} style={getNavPillStyle(activeView === 'login')}>
            {user ? `👤 ${user.name}` : 'Login'}
          </button>
        </nav>
      </header>

      {/* Main Viewport */}
      <main style={mainContentAreaStyle}>
        
        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <section style={heroFullContainerStyle}>
            <div style={heroLeftColumnStyle}>
              <div style={heroTaglineStyle}>✦ CLASSIC ARCADE ACTION ✦</div>
              <h1 style={heroHeadlineStyle}>
                Smash bricks, <br />
                <span style={heroGradientTextStyle}>chase high scores.</span>
              </h1>
              <p style={heroDescriptionStyle}>
                Experience pure arcade physics. Catch power-ups, trigger multi-balls, and survive escalating wave speeds.
              </p>
              <div style={heroButtonRowStyle}>
                <button className="bb-tactile-btn" onClick={handleStartGame} style={gold3DButtonStyle}>
                  ▶ PLAY GAME
                </button>
              </div>
              <div style={metricsStripStyle}>
                <div style={metricItemStyle}><span style={metricNumberStyle}>ENDLESS</span><span style={metricLabelStyle}>WAVES</span></div>
                <div style={metricItemStyle}><span style={metricNumberStyle}>4</span><span style={metricLabelStyle}>POWER-UPS</span></div>
                <div style={metricItemStyle}><span style={metricNumberStyle}>LIVE</span><span style={metricLabelStyle}>SCALING</span></div>
              </div>
            </div>

            <div style={heroRightIslandContainerStyle}>
              <div style={islandGraphicStyle}>
                <div style={speechBubbleOverlayStyle}>
                  Clear all bricks to advance to the next wave!
                </div>
                <div style={mascotOrbFloatingStyle}>
                  <div style={mascotEyesStyle}><span style={mascotEyeStyle}/><span style={mascotEyeStyle}/></div>
                  <div style={mascotSmileStyle}/>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 2: LEADERBOARD */}
        {activeView === 'leaderboard' && (
          <section style={fullScreenViewContainerStyle}>
            <div style={sectionEyebrowStyle}>GLOBAL RANKINGS</div>
            <h2 style={sectionHeadingStyle}>Leaderboard (Top 20)</h2>
            <div style={leaderboardTabsRowStyle}>
              {['Global', 'Weekly', 'Friends'].map((tab) => (
                <button
                  key={tab}
                  className="bb-tactile-btn"
                  onClick={() => setLeaderboardTab(tab)}
                  style={{
                    ...leaderboardTabBtnStyle,
                    background: leaderboardTab === tab ? '#f59e0b' : 'rgba(15,35,52,0.85)',
                    color: leaderboardTab === tab ? '#0f172a' : '#cbd5e1'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {globalScores.length === 0 ? (
              <div style={{ padding: '40px 0', color: '#94a3b8', textAlign: 'center', width: '100%' }}>
                <p>No scores on the leaderboard yet. Be the first to play and set a high score!</p>
              </div>
            ) : (
              <div style={leaderboardGridFullStyle}>
                {globalScores.map((entry, index) => {
                  let badge = `#${index + 1}`;
                  if (index === 0) badge = '🥇';
                  else if (index === 1) badge = '🥈';
                  else if (index === 2) badge = '🥉';

                  return (
                    <div key={index} style={leaderboardRowStyle} className="bb-card-hover">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{badge}</span>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '1rem' }}>{entry.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Waves Reached: {entry.waves || 1} • 🪙 {entry.coins || 0} coins</div>
                        </div>
                      </div>
                      <span style={{ color: '#38bdf8', fontWeight: '900', fontSize: '1.1rem' }}>{entry.score.toLocaleString()} pts</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* VIEW 3: HISTORY */}
        {activeView === 'history' && (
          <section style={cardViewContainerStyle}>
            <div style={sectionEyebrowStyle}>SESSION LOGS</div>
            <h2 style={sectionHeadingStyle}>My Game History</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
              Your top completed run sessions saved locally on this browser.
            </p>
            {gameHistory.length === 0 ? (
              <div style={{ padding: '30px 0', color: '#94a3b8', textAlign: 'center', width: '100%' }}>
                <p>No matches recorded yet. Play an arcade session to log your runs!</p>
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                {gameHistory.map((h, idx) => (
                  <div key={h.id || idx} style={historyItemStyle} className="bb-card-hover">
                    <div>
                      <strong style={{ color: '#38bdf8' }}>{h.playerName || 'Player'} (Max Wave {h.maxWave || 1})</strong>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{h.date || 'Today'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#fbbf24', fontWeight: '800', display: 'block' }}>{h.score || 0} pts</span>
                      <span style={{ fontSize: '0.78rem', color: '#34d399' }}>🪙 +{h.totalCoins || 0} total coins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* VIEW 4: LOGIN */}
        {activeView === 'login' && (
          <section style={loginCardStyle} className="bb-card-hover">
            <div style={sectionEyebrowStyle}>ACCOUNT ACCESS</div>
            <h2 style={sectionHeadingStyle}>{user ? `Hi, ${user.name}!` : isSignUp ? 'Create Account' : 'Welcome back'}</h2>
            {user ? (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Logged in as <strong style={{ color: '#38bdf8' }}>{user.email}</strong></p>
                <button className="bb-tactile-btn" onClick={handleLogout} style={{ ...glassSecondaryButtonStyle, width: '100%' }}>Sign Out</button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} style={loginFormStyle}>
                <input type="text" placeholder="Your Name" value={nameInput} onChange={e => setNameInput(e.target.value)} style={loginInputStyle} required />
                <input type="email" placeholder="Email address" value={emailInput} onChange={e => setEmailInput(e.target.value)} style={loginInputStyle} required />
                <input type="password" placeholder="Password (6+ characters)" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} minLength={6} style={loginInputStyle} required />
                <button type="submit" className="bb-tactile-btn" style={{ ...gold3DButtonStyle, width: '100%', marginTop: '6px' }}>{isSignUp ? 'Sign Up' : 'Log In'}</button>
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={textLinkButtonStyle}>{isSignUp ? 'Already have an account? Log In' : 'Create an account'}</button>
              </form>
            )}
          </section>
        )}

        {/* VIEW 5: GAMEPLAY PLAYGROUND */}
        {activeView === 'play' && (
          <div style={gameplayWrapperStyle}>
            <div style={gameTopControlsStyle}>
              <button className="bb-nav-pill" onClick={() => setActiveView('home')} style={backMapBtnStyle}>
                ← Exit to Home
              </button>
              <button className="bb-nav-pill" onClick={() => setIsPaused(!isPaused)} style={pauseBtnStyle}>{isPaused ? '▶ Resume' : '⏸ Pause'}</button>
            </div>

            <GameCanvas
              key={gameKey}
              level={currentWave}
              lives={lives}
              setLives={setLives}
              soundEnabled={soundEnabled}
              activeBooster={activeBooster}
              onBoosterConsumed={() => setActiveBooster(null)}
              onGameOver={handleGameOver}
              onLevelClear={handleWaveClear}
              isPaused={isPaused || gameOver || levelCleared}
            />

            <div style={boosterTrayStyle}>
              <button className="bb-tactile-btn" onClick={() => handleActivateBooster('EXTRA_LIFE', 40)} style={boosterPillStyle}>❤️ +1 Life <span style={costStyle}>40 🪙</span></button>
              <button className="bb-tactile-btn" onClick={() => handleActivateBooster('WIDE_PADDLE', 30)} style={boosterPillStyle}>📏 Wide Paddle <span style={costStyle}>30 🪙</span></button>
              <button className="bb-tactile-btn" onClick={() => handleActivateBooster('LASER', 50)} style={boosterPillStyle}>⚡ Laser Cannon <span style={costStyle}>50 🪙</span></button>
            </div>
          </div>
        )}
      </main>

      {/* GAME OVER MODAL WITH NAME & EMAIL PROMPT */}
      {gameOver && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle} className="bb-card-hover">
            <h2>Game Over</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8', margin: '6px 0' }}>Final Score: {finalScore}</p>
            <p style={{ color: '#fbbf24', fontSize: '0.85rem', marginBottom: '16px' }}>🪙 Coins earned for this run!</p>

            {!user && !scoreSubmitted ? (
              <form onSubmit={handleGameOverScoreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', textAlign: 'left' }}>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '2px' }}>Enter your name & email to save score to Leaderboard & History:</p>
                <input type="text" placeholder="Your Name" value={gameOverNameInput} onChange={e => setGameOverNameInput(e.target.value)} style={loginInputStyle} required />
                <input type="email" placeholder="Email Address" value={gameOverEmailInput} onChange={e => setGameOverEmailInput(e.target.value)} style={loginInputStyle} required />
                <button type="submit" className="bb-tactile-btn" style={{ ...gold3DButtonStyle, width: '100%', padding: '12px', fontSize: '0.9rem', marginTop: '4px' }}>
                  Save & Submit Score
                </button>
              </form>
            ) : (
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '12px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 'bold' }}>✓ Score successfully saved & synced!</p>
              </div>
            )}

            <button className="bb-tactile-btn" onClick={handleRestart} style={{ ...gold3DButtonStyle, width: '100%' }}>Play Again</button>
          </div>
        </div>
      )}

      {/* WAVE CLEARED MODAL */}
      {levelCleared && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle} className="bb-card-hover">
            <h2>Wave Cleared!</h2>
            <p>Score: {finalScore} • +30 Coins Earned</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="bb-tactile-btn" onClick={() => { setLevelCleared(false); setActiveView('home'); }} style={{ ...glassSecondaryButtonStyle, flex: 1, padding: '12px' }}>
                ← Back to Home
              </button>
              <button className="bb-tactile-btn" onClick={handleNextWave} style={{ ...gold3DButtonStyle, flex: 1, padding: '12px' }}>
                Wave {currentWave} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================
const appContainerStyle = { minHeight: '100vh', width: '100vw', backgroundColor: '#061320', backgroundImage: 'radial-gradient(circle at 50% 15%, #0c3547 0%, #061320 75%)', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowX: 'hidden', margin: 0, padding: 0 };
const headerWrapperStyle = { width: '100%', padding: '14px 32px', borderBottom: '1px solid rgba(56, 189, 248, 0.12)', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', backgroundColor: 'rgba(6, 19, 32, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 };
const topBrandRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const brandIdentityStyle = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '12px' };
const brandOrbIconStyle = { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)' };
const brandNameStyle = { fontWeight: '900', fontSize: '1.05rem', letterSpacing: '0.04em', color: '#ffffff' };
const utilityPillsStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const coinDisplayStyle = { background: 'rgba(15, 35, 52, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '20px', padding: '6px 14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' };
const miniIconBtnStyle = { background: 'rgba(15, 35, 52, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' };

const navPillsContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '8px' };
const getNavPillStyle = (isActive) => ({ background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent', border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent', color: isActive ? '#ffffff' : '#cbd5e1', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' });
const mainContentAreaStyle = { width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 32px', boxSizing: 'border-box' };

const heroFullContainerStyle = { width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center', boxSizing: 'border-box' };
const heroLeftColumnStyle = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' };
const heroTaglineStyle = { color: '#fbbf24', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.12em', marginBottom: '14px' };
const heroHeadlineStyle = { fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: '900', lineHeight: '1.05', margin: '0 0 18px 0', color: '#ffffff' };
const heroGradientTextStyle = { background: 'linear-gradient(90deg, #34d399 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
const heroDescriptionStyle = { color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', margin: '0 0 32px 0', maxWidth: '480px' };
const heroButtonRowStyle = { display: 'flex', gap: '16px', width: '100%', maxWidth: '480px', marginBottom: '40px' };

const gold3DButtonStyle = { flex: 1, background: 'linear-gradient(180deg, #fde047 0%, #f59e0b 100%)', color: '#0f172a', border: 'none', borderRadius: '16px', padding: '16px 24px', fontSize: '1.05rem', fontWeight: '800', boxShadow: '0 6px 0 #b45309, 0 14px 28px rgba(245, 158, 11, 0.35)' };
const glassSecondaryButtonStyle = { flex: 1, background: 'rgba(15, 41, 61, 0.75)', color: '#ffffff', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '16px 24px', fontSize: '1.05rem', fontWeight: '700' };

const metricsStripStyle = { display: 'flex', gap: '48px' };
const metricItemStyle = { display: 'flex', flexDirection: 'column' };
const metricNumberStyle = { fontSize: '1.8rem', fontWeight: '900', color: '#ffffff' };
const metricLabelStyle = { fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.08em', color: '#94a3b8' };

const heroRightIslandContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' };
const islandGraphicStyle = { position: 'relative', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, #0e7490 0%, #065f46 70%, #061320 100%)', border: '6px solid rgba(56,189,248,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 60px rgba(14,116,144,0.4)' };
const speechBubbleOverlayStyle = { position: 'absolute', bottom: '30px', background: '#fff', color: '#0f172a', padding: '12px 18px', borderRadius: '16px', fontSize: '0.85rem', fontWeight: '700', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', textAlign: 'center', maxWidth: '220px' };
const mascotOrbFloatingStyle = { width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #7dd3fc 0%, #0284c7 75%, #0369a1 100%)', border: '3px solid #fff', boxShadow: '0 10px 25px rgba(2,132,199,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', transform: 'translateY(-30px)' };
const mascotEyesStyle = { display: 'flex', gap: '14px' };
const mascotEyeStyle = { width: '8px', height: '10px', borderRadius: '50%', background: '#0f172a' };
const mascotSmileStyle = { width: '18px', height: '9px', borderBottom: '3px solid #0f172a', borderRadius: '0 0 12px 12px' };

const cardViewContainerStyle = { width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const fullScreenViewContainerStyle = { width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const sectionEyebrowStyle = { color: '#fbbf24', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.12em', marginBottom: '6px' };
const sectionHeadingStyle = { fontSize: '2rem', fontWeight: '900', margin: '0 0 10px 0', color: '#ffffff' };

const leaderboardTabsRowStyle = { display: 'flex', gap: '8px', marginBottom: '16px', width: '100%' };
const leaderboardTabBtnStyle = { flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' };
const leaderboardGridFullStyle = { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxHeight: '420px', overflowY: 'auto' };
const leaderboardRowStyle = { background: 'rgba(13, 33, 51, 0.9)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box' };

const historyItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13,33,51,0.85)', border: '1px solid rgba(56,189,248,0.15)', padding: '14px 18px', borderRadius: '14px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' };

const loginCardStyle = { width: '100%', maxWidth: '420px', background: 'rgba(13, 33, 51, 0.9)', border: '1px solid rgba(56, 189, 248, 0.22)', borderRadius: '24px', padding: '32px 26px', boxSizing: 'border-box' };
const loginFormStyle = { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' };
const loginInputStyle = { width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.25)', background: '#071726', color: '#ffffff', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };
const textLinkButtonStyle = { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', marginTop: '6px' };

const gameplayWrapperStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' };
const gameTopControlsStyle = { width: '100%', maxWidth: '920px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const backMapBtnStyle = { background: 'rgba(15, 35, 52, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#cbd5e1', padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
const pauseBtnStyle = { background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.45)', color: '#38bdf8', padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' };
const boosterTrayStyle = { display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '920px', gap: '10px' };
const boosterPillStyle = { flex: 1, background: 'rgba(13, 33, 51, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', padding: '10px', color: '#fff', fontSize: '0.8rem', fontWeight: '700', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' };
const costStyle = { fontSize: '0.72rem', color: '#fbbf24', fontWeight: '800' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalCardStyle = { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px', borderRadius: '24px', textAlign: 'center', color: '#fff', width: '90%', maxWidth: '400px', border: '1px solid rgba(56,189,248,0.4)' };