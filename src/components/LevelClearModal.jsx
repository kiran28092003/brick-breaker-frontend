// frontend/src/components/LevelClearModal.jsx
import React from 'react';

export default function LevelClearModal({ level, score, coinsEarned, onNextLevel, onReplay }) {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={trophyIconStyle}>🏆</div>
        <h2 style={titleStyle}>Mossy Meadow • Level {level}</h2>
        <h3 style={subtitleStyle}>Garden Cleared!</h3>

        {/* Star Rating Animation / Display */}
        <div style={starsContainerStyle}>
          <span style={starStyle}>★</span>
          <span style={starStyle}>★</span>
          <span style={starStyle}>★</span>
        </div>

        {/* Reward Stats Grid */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Bonus</span>
            <span style={statValueStyle}>+{score}</span>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Coin Reward</span>
            <span style={coinValueStyle}>+{coinsEarned} 🪙</span>
          </div>
          <div style={statCardStyle}>
            <span style={statLabelStyle}>Status</span>
            <span style={statValueStyle}>Flawless</span>
          </div>
        </div>

        <p style={flavorTextStyle}>⭐ Flawless precision! You cleared all target bricks.</p>

        {/* Action Buttons */}
        <div style={buttonRowStyle}>
          <button onClick={onNextLevel} style={primaryButtonStyle}>
            Next Level &gt;
          </button>
          <button onClick={onReplay} style={secondaryButtonStyle}>
            Replay
          </button>
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
  zIndex: 100
};

const modalStyle = {
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  padding: '30px',
  borderRadius: '20px',
  textAlign: 'center',
  color: '#fff',
  width: '400px',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
};

const trophyIconStyle = {
  fontSize: '2.5rem',
  marginBottom: '10px'
};

const titleStyle = {
  margin: '0 0 5px 0',
  fontSize: '1rem',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const subtitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '1.75rem',
  fontWeight: '800',
  color: '#fff'
};

const starsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '20px'
};

const starStyle = {
  fontSize: '2rem',
  color: '#fbbf24',
  textShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginBottom: '20px'
};

const statCardStyle = {
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(51, 65, 85, 0.6)',
  borderRadius: '12px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const statLabelStyle = {
  fontSize: '0.7rem',
  color: '#94a3b8',
  textTransform: 'uppercase',
  marginBottom: '4px'
};

const statValueStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#38bdf8'
};

const coinValueStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#fbbf24'
};

const flavorTextStyle = {
  fontSize: '0.85rem',
  color: '#cbd5e1',
  fontStyle: 'italic',
  marginBottom: '25px'
};

const buttonRowStyle = {
  display: 'flex',
  gap: '10px'
};

const primaryButtonStyle = {
  flex: 2,
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem'
};

const secondaryButtonStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #475569',
  background: 'transparent',
  color: '#cbd5e1',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem'
};