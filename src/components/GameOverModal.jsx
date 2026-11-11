// frontend/src/components/GameOverModal.jsx
import React, { useEffect, useState } from 'react';

export default function GameOverModal({ score, onPlayAgain, onClose }) {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    // Automatically save score on mount
    const savedName = localStorage.getItem('brick_breaker_name') || 'Player';
    setPlayerName(savedName);

    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName: savedName, score })
    })
      .then((res) => res.json())
      .then(() => {
        setSaved(true);
        return fetch('/api/scores');
      })
      .then((res) => res.json())
      .then((data) => {
        setHighScores(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Error saving score:', err));
  }, [score]);

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Game Over!</h2>
          {onClose && <button onClick={onClose} style={closeIconButtonStyle}>✕</button>}
        </div>
        
        <p style={scoreLabelStyle}>Your Score: <strong style={{ color: '#38bdf8' }}>{score}</strong></p>
        
        {saved ? (
          <p style={successStyle}>Score Saved Successfully!</p>
        ) : (
          <p style={loadingStyle}>Saving score...</p>
        )}

        <div style={leaderboardSection}>
          <h3 style={lbTitleStyle}>Top High Scores</h3>
          <div style={listStyle}>
            {highScores.slice(0, 5).map((entry, idx) => (
              <div key={entry._id || idx} style={rankItemStyle}>
                <span>{idx + 1}. {entry.playerName}</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{entry.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={buttonGroupStyle}>
          <button onClick={onPlayAgain} style={primaryButtonStyle}>Play Again</button>
          {onClose && <button onClick={onClose} style={secondaryButtonStyle}>Close Window</button>}
        </div>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
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

const modalStyle = {
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  padding: '24px',
  borderRadius: '20px',
  textAlign: 'center',
  color: '#fff',
  width: '90%',
  maxWidth: '400px',
  border: '1px solid rgba(99, 102, 241, 0.4)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
  boxSizing: 'border-box'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.4rem',
  fontWeight: '800',
  color: '#f43f5e',
  width: '100%',
  textAlign: 'center'
};

const closeIconButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  fontSize: '1.1rem',
  cursor: 'pointer',
  position: 'absolute',
  right: '24px'
};

const scoreLabelStyle = {
  fontSize: '1.05rem',
  margin: '6px 0 12px 0',
  color: '#cbd5e1'
};

const successStyle = {
  color: '#22c55e',
  fontSize: '0.85rem',
  fontWeight: '700',
  marginBottom: '12px'
};

const loadingStyle = {
  color: '#94a3b8',
  fontSize: '0.85rem',
  marginBottom: '12px'
};

const leaderboardSection = {
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(51, 65, 85, 0.6)',
  borderRadius: '12px',
  padding: '10px 14px',
  marginBottom: '16px',
  textAlign: 'left'
};

const lbTitleStyle = {
  margin: '0 0 8px 0',
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#38bdf8',
  textAlign: 'center'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  maxHeight: '130px',
  overflowY: 'auto'
};

const rankItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.85rem',
  color: '#f8fafc',
  padding: '4px 8px',
  background: 'rgba(30, 41, 59, 0.5)',
  borderRadius: '6px'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px'
};

const primaryButtonStyle = {
  flex: 1,
  padding: '11px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

const secondaryButtonStyle = {
  flex: 1,
  padding: '11px',
  borderRadius: '10px',
  border: '1px solid #475569',
  background: 'rgba(30, 41, 59, 0.8)',
  color: '#cbd5e1',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.9rem'
};