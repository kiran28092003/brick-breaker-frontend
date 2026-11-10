// frontend/src/App.jsx
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameOverModal from './components/GameOverModal';
import LevelClearModal from './components/LevelClearModal';

export default function App() {
  const [gameOver, setGameOver] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [coins, setCoins] = useState(125); // Currency system like benchmark
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameKey, setGameKey] = useState(0);

  const handleGameOver = (score) => {
    setFinalScore(score);
    setGameOver(true);
  };

  const handleLevelClear = (score) => {
    setFinalScore(score);
    setCoins((c) => c + 25); // Reward 25 coins on level clear
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
    setFinalScore(0);
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

  return (
    <div style={appContainerStyle}>
      {/* Advanced Top Navbar (Benchmark Parity) */}
      <header style={navBarStyle}>
        <div style={brandSectionStyle}>
          <div style={logoIconStyle}>🧱</div>
          <span style={brandTitleStyle}>BRICK BREAKER</span>
        </div>

        <div style={navUtilityGroupStyle}>
          {/* Coin / Currency Counter */}
          <div style={badgeStyle}>
            🪙 <span style={{ color: '#fbbf24', marginLeft: '4px' }}>{coins}</span>
          </div>

          {/* Sound Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            style={iconButtonStyle} 
            title="Toggle Sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen} 
            style={iconButtonStyle} 
            title="Toggle Fullscreen"
          >
            ⤢
          </button>

          {/* User Profile Badge */}
          <div style={userAvatarStyle}>G</div>
        </div>
      </header>
      
      {/* Main Game Wrapper */}
      <main style={gameWrapperStyle}>
        <div style={canvasContainerStyle}>
          <GameCanvas 
            key={gameKey} 
            level={currentLevel}
            soundEnabled={soundEnabled}
            onGameOver={handleGameOver} 
            onLevelClear={handleLevelClear}
            isPaused={gameOver || levelCleared} 
          />
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <GameOverModal 
            score={finalScore} 
            onPlayAgain={handleRestart} 
          />
        )}

        {/* Rich Level Clear Modal */}
        {levelCleared && (
          <LevelClearModal 
            level={currentLevel}
            score={finalScore}
            coinsEarned={25}
            onNextLevel={handleNextLevel}
            onReplay={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

const appContainerStyle = {
  backgroundColor: '#030712',
  height: '100vh',
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
  overflow: 'hidden'
};

const navBarStyle = {
  width: '100%',
  maxWidth: '850px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  borderRadius: '16px',
  padding: '8px 16px',
  boxSizing: 'border-box'
};

const brandSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const logoIconStyle = {
  fontSize: '1.25rem',
  background: 'rgba(56, 189, 248, 0.2)',
  padding: '6px',
  borderRadius: '8px'
};

const brandTitleStyle = {
  fontSize: '1rem',
  fontWeight: '800',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(to right, #38bdf8, #818cf8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const navUtilityGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const badgeStyle = {
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #475569',
  borderRadius: '10px',
  padding: '6px 12px',
  fontSize: '0.85rem',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center'
};

const iconButtonStyle = {
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid #475569',
  borderRadius: '10px',
  width: '36px',
  height: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '1rem'
};

const userAvatarStyle = {
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  borderRadius: '10px',
  width: '36px',
  height: '36px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
};

const gameWrapperStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '750px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1
};

const canvasContainerStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(15, 23, 42, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  overflow: 'hidden',
  padding: '6px'
};