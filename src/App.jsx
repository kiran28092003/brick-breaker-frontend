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
      {/* Professional Header HUD */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>Brick Breaker Quest</h1>
        <p style={subtitleStyle}>Internship Production Build</p>
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
  backgroundColor: '#030712', // Deep immersive slate background
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  color: '#fff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: '16px',
  boxSizing: 'border-box',
  overflowX: 'hidden'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '16px',
};

const titleStyle = {
  margin: '0 0 4px 0',
  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
  fontWeight: '800',
  letterSpacing: '-0.025em',
  background: 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const subtitleStyle = {
  margin: 0,
  fontSize: '0.85rem',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: '600'
};

const gameWrapperStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  paddingBottom: '20px'
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
  padding: '8px'
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