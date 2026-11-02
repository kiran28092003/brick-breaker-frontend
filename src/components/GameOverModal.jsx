// frontend/src/components/GameOverModal.jsx
import React, { useState, useEffect } from 'react';
import { getScores, saveScore } from '../services/scoreService';

export default function GameOverModal({ score, onPlayAgain }) {
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const data = await getScores();
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    try {
      await saveScore(playerName.trim(), score);
      setIsSaved(true);
      setError('');
      fetchLeaderboard();
    } catch (err) {
      setError('Failed to save score. Please try again.');
    }
  };

  return (
    <div style={modalStyle}>
      <h2>Game Over!</h2>
      <h3>Your Score: {score}</h3>

      {!isSaved ? (
        <form onSubmit={handleSubmitScore} style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={inputStyle}
            maxLength={15}
            required
          />
          <button type="submit" style={buttonStyle}>
            Save Score
          </button>
        </form>
      ) : (
        <p style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '15px' }}>
          Score Saved Successfully!
        </p>
      )}

      {error && <p style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</p>}

      <h3>Top High Scores</h3>
      <ol style={listStyle}>
        {leaderboard.map((entry, index) => (
          <li key={entry._id || index} style={listItemStyle}>
            <span>{index + 1}. {entry.playerName}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ol>

      <button 
        onClick={onPlayAgain} 
        style={{ ...buttonStyle, backgroundColor: '#6366f1', width: '100%', marginTop: '15px' }}
      >
        Play Again
      </button>
    </div>
  );
}

const modalStyle = {
  background: '#1e293b',
  padding: '25px',
  borderRadius: '12px',
  textAlign: 'center',
  color: '#fff',
  width: '330px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #475569',
  outline: 'none',
  marginRight: '8px',
  background: '#0f172a',
  color: '#fff'
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const listStyle = {
  textAlign: 'left',
  padding: 0,
  listStyle: 'none',
  maxHeight: '130px',
  overflowY: 'auto',
  margin: '10px 0'
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '5px 10px',
  borderBottom: '1px solid #334155'
};