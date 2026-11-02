const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/scores';

export const getScores = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch scores');
    return await res.json();
  } catch (err) {
    console.error('Error fetching scores:', err);
    return [];
  }
};

export const saveScore = async (playerName, score) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, score })
    });
    if (!res.ok) throw new Error('Failed to save score');
    return await res.json();
  } catch (err) {
    console.error('Error saving score:', err);
    throw err;
  }
};