// frontend/src/App.jsx
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import GameOverModal from './components/GameOverModal';

export default function App() {
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleGameOver = (score) => {
    setFinalScore(score);
    setGameOver(true);
  };

  const handleRestart = () => {
    setGameOver(false);
    setFinalScore(0);
    setGameKey((prevKey) => prevKey + 1); // Remounts canvas for a fresh start
  };

  return (
    <div style={appContainerStyle}>
      {/* Professional Header HUD (Subtitle removed) */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>Brick Breaker Quest</h1>
      </header>
      
      {/* Main Responsive Game Wrapper */}
      <main style={gameWrapperStyle}>
        <div style={canvasContainerStyle}>
          <GameCanvas 
            key={gameKey} 
            onGameOver={handleGameOver} 
            isPaused={gameOver} 
          />
        </div>

        {gameOver && (
          <div style={modalOverlayWrapperStyle}>
            <GameOverModal 
              score={finalScore} 
              onPlayAgain={handleRestart} 
            />
          </div>
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
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '8px',
  boxSizing: 'border-box',
  overflow: 'hidden' // Completely locks scrolling on all devices
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '8px',
};

const titleStyle = {
  margin: 0,
  fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
  fontWeight: '800',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const gameWrapperStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '750px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
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

const modalOverlayWrapperStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(3, 7, 18, 0.9)',
  backdropFilter: 'blur(8px)',
  borderRadius: '16px',
  zIndex: 10
};