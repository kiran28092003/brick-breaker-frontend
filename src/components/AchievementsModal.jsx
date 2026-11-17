// frontend/src/components/AchievementsModal.jsx
import React from 'react';

export default function AchievementsModal({ score, onClose }) {
  const achievements = [
    { id: 1, title: '🚀 First Launch', desc: 'Start your first game', unlocked: true },
    { id: 2, title: '💯 Century Scorer', desc: 'Score over 100 points', unlocked: score >= 100 },
    { id: 3, title: '⚡ Arcade Veteran', desc: 'Clear level 2 or higher', unlocked: score >= 200 },
    { id: 4, title: '🏆 High Scorer', desc: 'Successfully submit a score', unlocked: score > 0 },
  ];

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#38bdf8' }}>🏅 Arcade Achievements</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '240px', overflowY: 'auto' }}>
          {achievements.map((ach) => (
            <div key={ach.id} style={{ 
              background: ach.unlocked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(15, 23, 42, 0.6)', 
              border: `1px solid ${ach.unlocked ? '#22c55e' : 'rgba(51, 65, 85, 0.6)'}`,
              padding: '10px 14px', borderRadius: '10px', textAlign: 'left' 
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: ach.unlocked ? '#22c55e' : '#94a3b8' }}>
                {ach.unlocked ? '✅' : '🔒'} {ach.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{ach.desc}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={actionButtonStyle}>Back to Game</button>
      </div>
    </div>
  );
}

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000 };
const modalStyle = { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '24px', borderRadius: '20px', textAlign: 'center', color: '#fff', width: '90%', maxWidth: '400px', border: '1px solid rgba(99, 102, 241, 0.4)', boxSizing: 'border-box' };
const closeButtonStyle = { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' };
const actionButtonStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };