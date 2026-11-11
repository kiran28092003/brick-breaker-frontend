// frontend/src/App.jsx
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameOverModal from './components/GameOverModal';
import LevelClearModal from './components/LevelClearModal';
import LeaderboardModal from './components/LeaderboardModal';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false); // Game starts paused initially
  const [gameOver, setGameOver] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [coins, setCoins] = useState(150);
  const [lives, setLives] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameKey, setGameKey] = useState(0);
  const [activeBooster, setActiveBooster] = useState(null);

  const handleGameOver = (score) => {
    setFinalScore(score);
    setGameOver(true);
  };

  const handleLevelClear = (score) => {
    setFinalScore(score);
    setCoins((c) => c + 25);
    setLevelCleared(true);
  };

  const handleNextLevel = () => {
    setLevelCleared(false);
    setCurrentLevel((l) => l + 1);
    setGameKey((prev) => prev + 1);
  };

  const handleRestart = () => {
    setGameOver(false);
    setLevelCleared(false);
    setCurrentLevel(1);
    setLives(3);
    setFinalScore(0);
    setGameStarted(true);
    setGameKey((prevKey) => prevKey + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleActivateBooster = (type, cost) => {
    if (coins >= cost) {
      setCoins((c) => c - cost);
      setActiveBooster(type);
    } else {
      alert('Not enough coins!');
    }
  };

  return (
    <div style={appContainerStyle}>
      {/* Advanced Top Navbar */}
      <header style={navBarStyle}>
        <div style={brandSectionStyle}>
          <div style={logoIconStyle}>🧱</div>
          <span style={brandTitleStyle}>BRICK BREAKER</span>
        </div>

        <div style={navUtilityGroupStyle}>
          <div style={badgeStyle}>
            🪙 <span style={{ color: '#fbbf24', marginLeft: '4px' }}>{coins}</span>
          </div>

          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            style={iconButtonStyle} 
            title="Toggle Sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          <button 
            onClick={toggleFullscreen} 
            style={iconButtonStyle} 
            title="Toggle Fullscreen"
          >
            ⤢
          </button>

          <div 
            onClick={() => setShowLeaderboard(true)} 
            style={userAvatarStyle} 
            title="View Leaderboard"
          >
            G
          </div>
        </div>
      </header>
      
      {/* Main Game Wrapper */}
      <main style={gameWrapperStyle}>
        <div style={canvasContainerStyle}>
          <GameCanvas 
            key={gameKey} 
            level={currentLevel}
            lives={lives}
            setLives={setLives}
            soundEnabled={soundEnabled}
            activeBooster={activeBooster}
            onBoosterConsumed={() => setActiveBooster(null)}
            onGameOver={handleGameOver} 
            onLevelClear={handleLevelClear}
            isPaused={!gameStarted || gameOver || levelCleared || showLeaderboard} 
          />
        </div>

        {/* Power-Up Booster Tray */}
        <div style={boosterTrayStyle}>
          <button 
            onClick={() => handleActivateBooster('EXTRA_LIFE', 50)} 
            style={boosterButtonStyle}
          >
            ❤️ +1 Life <span style={costStyle}>50 🪙</span>
          </button>
          <button 
            onClick={() => handleActivateBooster('WIDE_PADDLE', 40)} 
            style={boosterButtonStyle}
          >
            📏 Wide Paddle <span style={costStyle}>40 🪙</span>
          </button>
          <button 
            onClick={() => handleActivateBooster('LASER', 60)} 
            style={boosterButtonStyle}
          >
            ⚡ Laser Cannon <span style={costStyle}>60 🪙</span>
          </button>
        </div>
      </main>

      {/* Start Game Welcome Modal */}
      {!gameStarted && !showLeaderboard && (
        <div style={modalOverlayWrapperStyle}>
          <div style={welcomeModalStyle}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧱🚀</div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#38bdf8' }}>Brick Breaker Quest</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
              Destroy bricks, collect power-ups, and climb the global leaderboard!
            </p>
            <button 
              onClick={() => setGameStarted(true)} 
              style={startButtonStyle}
            >
              ▶ Start Game
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {gameOver && (
        <div style={modalOverlayWrapperStyle}>
          <GameOverModal 
            score={finalScore} 
            onPlayAgain={handleRestart}
            onClose={() => setGameOver(false)} 
          />
        </div>
      )}

      {levelCleared && (
        <div style={modalOverlayWrapperStyle}>
          <LevelClearModal 
            level={currentLevel}
            score={finalScore}
            coinsEarned={25}
            onNextLevel={handleNextLevel}
            onReplay={handleRestart}
          />
        </div>
      )}

      {showLeaderboard && (
        <LeaderboardModal 
          onClose={() => setShowLeaderboard(false)} 
        />
      )}
    </div>
  );
}

const appContainerStyle = {
  backgroundColor: '#030712',
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  color: '#fff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '6px 12px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  position: 'fixed',
  top: 0,
  left: 0
};

const navBarStyle = {
  width: '100%',
  maxWidth: '980px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  borderRadius: '14px',
  padding: '6px 14px',
  boxSizing: 'border-box'
};

const brandSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const logoIconStyle = {
  fontSize: '1rem',
  background: 'rgba(56, 189, 248, 0.2)',
  padding: '4px 6px',
  borderRadius: '6px'
};

const brandTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '800',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(to right, #38bdf8, #818cf8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const navUtilityGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const badgeStyle = {
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #475569',
  borderRadius: '8px',
  padding: '4px 10px',
  fontSize: '0.8rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center'
};

const iconButtonStyle = {
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #475569',
  borderRadius: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

const userAvatarStyle = {
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  borderRadius: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '0.85rem',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
};

const gameWrapperStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '980px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
};

const canvasContainerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const boosterTrayStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '920px',
  gap: '8px'
};

const boosterButtonStyle = {
  flex: 1,
  background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(99, 102, 241, 0.4)',
  borderRadius: '10px',
  padding: '8px',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
};

const costStyle = {
  fontSize: '0.65ln',
  color: '#fbbf24'
};

const modalOverlayWrapperStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(3, 7, 18, 0.85)',
  backdropFilter: 'blur(8px)',
  zIndex: 1000
};

const welcomeModalStyle = {
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  padding: '30px',
  borderRadius: '20px',
  textAlign: 'center',
  color: '#fff',
  width: '90%',
  maxWidth: '380px',
  border: '1px solid rgba(99, 102, 241, 0.5)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
  boxSizing: 'border-box'
};

const startButtonStyle = {
  width: '100%',
  padding: '13px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
};