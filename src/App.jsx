// frontend/src/App.jsx
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameOverModal from './components/GameOverModal';
import LevelClearModal from './components/LevelClearModal';
import LeaderboardModal from './components/LeaderboardModal';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [coins, setCoins] = useState(225); // Matching reference polish economy
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
    setIsPaused(false);
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
      {/* Professional Top Navigation Bar */}
      <header style={navBarStyle}>
        <div style={brandSectionStyle}>
          <div style={logoIconStyle}>🧱</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={brandTitleStyle}>BRICK BREAKER QUEST</span>
            <span style={subTitleStyle}>Level {currentLevel} • Arcade Mode</span>
          </div>
        </div>

        <div style={navUtilityGroupStyle}>
          <div style={coinBadgeStyle}>
            🪙 <span style={{ color: '#fbbf24', marginLeft: '6px', fontWeight: '800' }}>{coins}</span>
          </div>

          {gameStarted && (
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              style={actionToolbarButtonStyle}
              title={isPaused ? "Resume Game" : "Pause Game"}
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}

          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            style={iconActionButtonStyle} 
            title="Toggle Sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          <button 
            onClick={toggleFullscreen} 
            style={iconActionButtonStyle} 
            title="Toggle Fullscreen"
          >
            ⤢
          </button>

          <button 
            onClick={() => setShowLeaderboard(true)} 
            style={profileBadgeButtonStyle} 
            title="View Leaderboard"
          >
            🏆
          </button>
        </div>
      </header>
      
      {/* Main Game Wrapper with Professional Layout Constraints */}
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
            isPaused={!gameStarted || isPaused || gameOver || levelCleared || showLeaderboard} 
          />
        </div>

        {/* Professional Power-Up Booster Toolbar */}
        <div style={boosterTrayStyle}>
          <button 
            onClick={() => handleActivateBooster('EXTRA_LIFE', 50)} 
            style={boosterPillStyle}
          >
            ❤️ +1 Life <span style={costStyle}>50 🪙</span>
          </button>
          <button 
            onClick={() => handleActivateBooster('WIDE_PADDLE', 40)} 
            style={boosterPillStyle}
          >
            📏 Wide Paddle <span style={costStyle}>40 🪙</span>
          </button>
          <button 
            onClick={() => handleActivateBooster('LASER', 60)} 
            style={boosterPillStyle}
          >
            ⚡ Laser Cannon <span style={costStyle}>60 🪙</span>
          </button>
        </div>
      </main>

      {/* Initial Start Game Professional Modal Overlay */}
      {!gameStarted && (
        <div style={modalOverlayWrapperStyle}>
          <div style={welcomeModalStyle}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧱</div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8' }}>Brick Breaker Quest</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
              Experience high-octane arcade action with dynamic power-ups, smooth Web Audio synthesis, and real-time MongoDB leaderboard tracking.
            </p>
            <button 
              onClick={() => {
                setGameStarted(true);
                setIsPaused(false);
              }} 
              style={startMainButtonStyle}
            >
              ▶ Play Game Now
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
  backgroundColor: '#070b19',
  backgroundImage: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #070b19 75%)',
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#fff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '12px 16px',
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
  background: 'rgba(15, 23, 42, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(99, 102, 241, 0.25)',
  borderRadius: '16px',
  padding: '10px 18px',
  boxSizing: 'border-box',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
};

const brandSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const logoIconStyle = {
  fontSize: '1.2rem',
  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(99, 102, 241, 0.3))',
  padding: '8px 10px',
  borderRadius: '10px',
  border: '1px solid rgba(56, 189, 248, 0.4)'
};

const brandTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '800',
  letterSpacing: '0.05em',
  background: 'linear-gradient(to right, #38bdf8, #818cf8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const subTitleStyle = {
  fontSize: '0.7rem',
  color: '#94a3b8',
  fontWeight: '600'
};

const navUtilityGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const coinBadgeStyle = {
  background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(71, 85, 105, 0.6)',
  borderRadius: '12px',
  padding: '6px 14px',
  fontSize: '0.85rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
};

const actionToolbarButtonStyle = {
  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
  border: '1px solid rgba(129, 140, 248, 0.5)',
  borderRadius: '12px',
  padding: '7px 14px',
  color: '#fff',
  fontSize: '0.8rem',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
  transition: 'all 0.2s ease'
};

const iconActionButtonStyle = {
  background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(71, 85, 105, 0.6)',
  borderRadius: '12px',
  width: '36px',
  height: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.95rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.2s ease'
};

const profileBadgeButtonStyle = {
  background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
  border: '1px solid rgba(168, 85, 247, 0.5)',
  borderRadius: '12px',
  width: '36px',
  height: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
  transition: 'all 0.2s ease'
};

const gameWrapperStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '980px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  flex: 1,
  padding: '6px 0'
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
  gap: '10px'
};

const boosterPillStyle = {
  flex: 1,
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(99, 102, 241, 0.35)',
  borderRadius: '14px',
  padding: '10px',
  color: '#fff',
  fontSize: '0.8rem',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3px',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.4)',
  transition: 'all 0.2s ease'
};

const costStyle = {
  fontSize: '0.7rem',
  color: '#fbbf24',
  fontWeight: '800'
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
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  zIndex: 1000
};

const welcomeModalStyle = {
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  padding: '36px 30px',
  borderRadius: '24px',
  textAlign: 'center',
  color: '#fff',
  width: '90%',
  maxWidth: '420px',
  border: '1px solid rgba(99, 102, 241, 0.5)',
  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
  boxSizing: 'border-box'
};

const startMainButtonStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '14px',
  border: 'none',
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  color: '#fff',
  fontWeight: '800',
  cursor: 'pointer',
  fontSize: '1.05rem',
  boxShadow: '0 8px 20px rgba(34, 197, 94, 0.45)',
  letterSpacing: '0.02em',
  transition: 'all 0.2s ease'
};