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
      <h1 style={titleStyle}>Brick Breaker Quest</h1>
      
      <div style={gameWrapperStyle}>
        <GameCanvas 
          key={gameKey} 
          onGameOver={handleGameOver} 
          isPaused={gameOver} 
        />

        {gameOver && (
          <div style={modalOverlayWrapperStyle}>
            <GameOverModal 
              score={finalScore} 
              onPlayAgain={handleRestart} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

const appContainerStyle = {
  backgroundColor: '#090d16',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontFamily: 'sans-serif',
  margin: 0,
  padding: '10px'
};

const titleStyle = {
  marginBottom: '10px',
  fontSize: '2rem',
  background: 'linear-gradient(to right, #38bdf8, #6366f1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const gameWrapperStyle = {
  position: 'relative',
  display: 'inline-block'
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
  backgroundColor: 'rgba(15, 23, 42, 0.85)',
  borderRadius: '8px'
};