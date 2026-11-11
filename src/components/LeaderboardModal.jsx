// frontend/src/components/LeaderboardModal.jsx
import React, { useEffect, useState } from 'react';

export default function LeaderboardModal({ onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual deployed Node/Express backend URL on Render/Railway/etc.
    // e.g. 'https://your-backend-service.onrender.com/api/scores'
    const BACKEND_URL = ''; // Leave empty if using a Vercel rewrite proxy, or insert your full backend URL string here

    fetch(`${BACKEND_URL}/api/scores`)
      .then((res) => res.json())
      .then((data) => {
        setScores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load leaderboard:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>🏆 Global Leaderboard</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        {loading ? (
          <p style={statusTextStyle}>Loading high scores...</p>
        ) : scores.length === 0 ? (
          <p style={statusTextStyle}>No high scores logged yet!</p>
        ) : (
          <div style={listStyle}>
            {scores.slice(0, 10).map((entry, index) => (
              <div key={entry._id || index} style={rankItemStyle}>
                <div style={rankLeftStyle}>
                  <span style={rankNumberStyle}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span style={nameStyle}>{entry.playerName || 'Anonymous'}</span>
                </div>
                <span style={scoreStyle}>{entry.score} pts</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} style={actionButtonStyle}>Back to Game</button>
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
  maxWidth: '420px',
  border: '1px solid rgba(99, 102, 241, 0.4)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
  boxSizing: 'border-box'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: '800',
  color: '#38bdf8'
};

const closeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  fontSize: '1.2rem',
  cursor: 'pointer'
};

const statusTextStyle = {
  color: '#94a3b8',
  padding: '20px 0'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxHeight: '260px',
  overflowY: 'auto',
  marginBottom: '20px',
  paddingRight: '4px'
};

const rankItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(51, 65, 85, 0.6)',
  borderRadius: '10px',
  padding: '10px 14px'
};

const rankLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const rankNumberStyle = {
  fontWeight: 'bold',
  fontSize: '1rem',
  minWidth: '24px'
};

const nameStyle = {
  fontWeight: '600',
  color: '#f8fafc',
  fontSize: '0.95rem'
};

const scoreStyle = {
  fontWeight: '800',
  color: '#fbbf24',
  fontSize: '0.95rem'
};

const actionButtonStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.95rem'
};