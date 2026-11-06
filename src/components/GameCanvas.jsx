// frontend/src/components/GameCanvas.jsx
import React, { useRef, useEffect, useState } from 'react';

// Virtual logical game resolution (maintains perfect 5:3 arcade aspect ratio)
const VIRTUAL_WIDTH = 750;
const VIRTUAL_HEIGHT = 450;

// Web Audio Synthesizer (No external sound files required)
const playSound = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'break') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (err) {
    // Audio Context block handler
  }
};

export default function GameCanvas({ onGameOver, isPaused }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOverTriggered, setGameOverTriggered] = useState(false);

  // Active game engine state
  const gameState = useRef({
    paddle: { x: 325, width: 100, height: 15, speed: 8, dx: 0, hasLaser: false },
    balls: [{ x: 375, y: 300, radius: 8, dx: 4, dy: -4 }],
    bricks: [],
    powerUps: [],
    particles: [],
    lasers: []
  });

  // Spawn visual brick explosion particles
  const createParticles = (x, y, color) => {
    for (let i = 0; i < 12; i++) {
      gameState.current.particles.push({
        x: x + 40,
        y: y + 10,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        radius: Math.random() * 3 + 2,
        color: color,
        life: 1.0
      });
    }
  };

  // Build level brick layout
  const initBricks = (currentLevel) => {
    const rows = Math.min(4 + currentLevel, 8);
    const cols = 8;
    const brickWidth = 80;
    const brickHeight = 20;
    const padding = 10;
    const offsetTop = 40;
    const offsetLeft = 15;

    const bricks = [];
    for (let r = 0; r < rows; r++) {
      bricks[r] = [];
      for (let c = 0; c < cols; c++) {
        const hitsRequired = (r === 0 && currentLevel > 1) ? 2 : 1;
        bricks[r][c] = {
          x: c * (brickWidth + padding) + offsetLeft,
          y: r * (brickHeight + padding) + offsetTop,
          status: hitsRequired,
          maxHits: hitsRequired,
          color: r === 0 ? '#ff4d4d' : r === 1 ? '#ffa64d' : r === 2 ? '#ffff4d' : '#4dff4d'
        };
      }
    }
    return bricks;
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOverTriggered(false);

    gameState.current.paddle = { x: 325, width: 100, height: 15, speed: 8, dx: 0, hasLaser: false };
    gameState.current.balls = [{ x: 375, y: 300, radius: 8, dx: 4, dy: -4 }];
    gameState.current.bricks = initBricks(1);
    gameState.current.powerUps = [];
    gameState.current.particles = [];
    gameState.current.lasers = [];
  };

  const nextLevel = () => {
    playSound('powerup');
    setLevel((prev) => {
      const newLevel = prev + 1;
      const speedMultiplier = 1 + (newLevel - 1) * 0.2;
      
      gameState.current.balls = [{ 
        x: 375, 
        y: 300, 
        radius: 8, 
        dx: 4 * speedMultiplier, 
        dy: -4 * speedMultiplier 
      }];
      gameState.current.bricks = initBricks(newLevel);
      return newLevel;
    });
  };

  useEffect(() => {
    resetGame();
  }, []);

  // Responsive Canvas Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Fit container width dynamically while keeping 5:3 ratio
      const containerWidth = container.clientWidth - 16;
      const calculatedHeight = containerWidth * (VIRTUAL_HEIGHT / VIRTUAL_WIDTH);

      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${calculatedHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controls & Listeners (Supports Keyboard, Mouse, and Mobile Touch)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd') {
        gameState.current.paddle.dx = gameState.current.paddle.speed;
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        gameState.current.paddle.dx = -gameState.current.paddle.speed;
      } else if (e.key === ' ' || e.code === 'Space') {
        const paddle = gameState.current.paddle;
        if (paddle.hasLaser) {
          playSound('laser');
          gameState.current.lasers.push(
            { x: paddle.x + 10, y: VIRTUAL_HEIGHT - 35, dy: -8 },
            { x: paddle.x + paddle.width - 10, y: VIRTUAL_HEIGHT - 35, dy: -8 }
          );
        }
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowRight', 'ArrowLeft', 'a', 'd'].includes(e.key)) {
        gameState.current.paddle.dx = 0;
      }
    };

    // Unified coordinate mapper for Mouse & Touch scaling
    const updatePaddlePosition = (clientX) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = VIRTUAL_WIDTH / rect.width;
      const relativeX = (clientX - rect.left) * scaleX;
      
      if (relativeX >= 0 && relativeX <= VIRTUAL_WIDTH) {
        gameState.current.paddle.x = relativeX - gameState.current.paddle.width / 2;
      }
    };

    const handleMouseMove = (e) => updatePaddlePosition(e.clientX);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updatePaddlePosition(e.touches[0].clientX);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('mousemove', handleMouseMove);
      canvasElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvasElement) {
        canvasElement.removeEventListener('mousemove', handleMouseMove);
        canvasElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  // Main Game Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const loop = () => {
      if (isPaused || gameOverTriggered) return;

      const { paddle, balls, bricks, powerUps, particles, lasers } = gameState.current;

      ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // --- 1. Draw Paddle ---
      ctx.fillStyle = paddle.hasLaser ? '#f59e0b' : '#6366f1';
      ctx.shadowBlur = 12;
      ctx.shadowColor = paddle.hasLaser ? '#f59e0b' : '#6366f1';
      ctx.fillRect(paddle.x, VIRTUAL_HEIGHT - 30, paddle.width, paddle.height);
      ctx.shadowBlur = 0;

      // Laser Cannon Indicators
      if (paddle.hasLaser) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(paddle.x + 5, VIRTUAL_HEIGHT - 35, 6, 5);
        ctx.fillRect(paddle.x + paddle.width - 11, VIRTUAL_HEIGHT - 35, 6, 5);
      }

      paddle.x += paddle.dx;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.width > VIRTUAL_WIDTH) paddle.x = VIRTUAL_WIDTH - paddle.width;

      // --- 2. Update & Draw Lasers ---
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.y += l.dy;

        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(l.x - 2, l.y, 4, 10);

        let laserHit = false;
        for (let r = 0; r < bricks.length; r++) {
          for (let c = 0; c < bricks[r].length; c++) {
            const b = bricks[r][c];
            if (b.status > 0 && l.x > b.x && l.x < b.x + 80 && l.y < b.y + 20 && l.y > b.y) {
              b.status -= 1;
              setScore((s) => s + 10);
              playSound(b.status === 0 ? 'break' : 'hit');
              createParticles(b.x, b.y, b.color);
              laserHit = true;
              break;
            }
          }
          if (laserHit) break;
        }

        if (laserHit || l.y < 0) lasers.splice(i, 1);
      }

      // --- 3. Update & Draw Balls ---
      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.closePath();

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collisions
        if (ball.x + ball.radius > VIRTUAL_WIDTH || ball.x - ball.radius < 0) {
          ball.dx *= -1;
          playSound('hit');
        }
        if (ball.y - ball.radius < 0) {
          ball.dy *= -1;
          playSound('hit');
        }

        // Paddle collision
        if (
          ball.y + ball.radius >= VIRTUAL_HEIGHT - 30 &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.width
        ) {
          ball.dy = -Math.abs(ball.dy);
          playSound('hit');
        }

        // Ball out of bounds
        if (ball.y + ball.radius > VIRTUAL_HEIGHT) {
          balls.splice(i, 1);
        }
      }

      // If no balls remaining, lose a life
      if (balls.length === 0) {
        setLives((prevLives) => {
          const updatedLives = prevLives - 1;
          if (updatedLives <= 0) {
            setGameOverTriggered(true);
            setTimeout(() => {
              setScore((currentScore) => {
                onGameOver(currentScore);
                return currentScore;
              });
            }, 0);
          } else {
            setLevel((currentLevel) => {
              const speedMultiplier = 1 + (currentLevel - 1) * 0.2;
              gameState.current.balls.push({ 
                x: 375, 
                y: 300, 
                radius: 8, 
                dx: 4 * speedMultiplier, 
                dy: -4 * speedMultiplier 
              });
              return currentLevel;
            });
          }
          return updatedLives;
        });
      }

      // --- 4. Draw & Update Bricks ---
      let remainingBricks = 0;
      for (let r = 0; r < bricks.length; r++) {
        for (let c = 0; c < bricks[r].length; c++) {
          const b = bricks[r][c];
          if (b.status > 0) {
            remainingBricks++;
            ctx.fillStyle = b.status === 2 ? '#e11d48' : b.color;
            ctx.fillRect(b.x, b.y, 80, 20);

            // Ball Collision Check
            for (let ball of balls) {
              if (
                ball.x > b.x &&
                ball.x < b.x + 80 &&
                ball.y - ball.radius < b.y + 20 &&
                ball.y + ball.radius > b.y
              ) {
                ball.dy *= -1;
                b.status -= 1;
                setScore((prev) => prev + 10);
                createParticles(b.x, b.y, b.color);
                playSound(b.status === 0 ? 'break' : 'hit');

                // 25% Power-Up Drop Chance
                if (b.status === 0 && Math.random() < 0.25) {
                  const types = ['WIDE_PADDLE', 'EXTRA_LIFE', 'MULTI_BALL', 'LASER'];
                  const selectedType = types[Math.floor(Math.random() * types.length)];
                  powerUps.push({ x: b.x + 40, y: b.y + 20, type: selectedType, dy: 2 });
                }
              }
            }
          }
        }
      }

      if (remainingBricks === 0 && bricks.length > 0) {
        nextLevel();
      }

      // --- 5. Draw & Update Particles ---
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // --- 6. Draw & Catch Power-Ups ---
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const p = powerUps[i];
        p.y += p.dy;

        ctx.fillStyle = 
          p.type === 'WIDE_PADDLE' ? '#a855f7' : 
          p.type === 'EXTRA_LIFE' ? '#22c55e' : 
          p.type === 'MULTI_BALL' ? '#ef4444' : '#f59e0b';

        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();

        if (
          p.y + 10 >= VIRTUAL_HEIGHT - 30 &&
          p.x >= paddle.x &&
          p.x <= paddle.x + paddle.width
        ) {
          playSound('powerup');
          if (p.type === 'WIDE_PADDLE') {
            paddle.width = Math.min(paddle.width + 30, 180);
          } else if (p.type === 'EXTRA_LIFE') {
            setLives((l) => l + 1);
          } else if (p.type === 'MULTI_BALL') {
            balls.push(
              { x: paddle.x + 20, y: VIRTUAL_HEIGHT - 40, radius: 8, dx: -3, dy: -5 },
              { x: paddle.x + paddle.width - 20, y: VIRTUAL_HEIGHT - 40, radius: 8, dx: 3, dy: -5 }
            );
          } else if (p.type === 'LASER') {
            paddle.hasLaser = true;
          }
          powerUps.splice(i, 1);
        } else if (p.y > VIRTUAL_HEIGHT) {
          powerUps.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    if (!isPaused && !gameOverTriggered) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, gameOverTriggered, onGameOver]);

  return (
    <div ref={containerRef} style={wrapperStyle}>
      {/* Modern HUD Header */}
      <div style={hudStyle}>
        <div style={hudCardStyle}>
          <span style={hudLabelStyle}>Score</span>
          <span style={hudValueStyle}>{score}</span>
        </div>
        <div style={hudCardStyle}>
          <span style={hudLabelStyle}>Level</span>
          <span style={hudLevelValueStyle}>{level}</span>
        </div>
        <div style={hudCardStyle}>
          <span style={hudLabelStyle}>Lives</span>
          <span style={hudLifeValueStyle}>{"❤️".repeat(lives)}</span>
        </div>
      </div>

      {/* Responsive Canvas */}
      <canvas
        ref={canvasRef}
        width={VIRTUAL_WIDTH}
        height={VIRTUAL_HEIGHT}
        style={canvasStyle}
      />
    </div>
  );
}

const wrapperStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box'
};

const hudStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '750px',
  marginBottom: '12px',
  gap: '8px'
};

const hudCardStyle = {
  flex: 1,
  background: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  borderRadius: '12px',
  padding: '8px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
};

const hudLabelStyle = {
  fontSize: '0.7rem',
  color: '#94a3b8',
  textTransform: 'uppercase',
  fontWeight: '700',
  letterSpacing: '0.05em',
  marginBottom: '2px'
};

const hudValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '800',
  color: '#38bdf8'
};

const hudLevelValueStyle = {
  fontSize: '1.25rem',
  fontWeight: '800',
  color: '#fbbf24'
};

const hudLifeValueStyle = {
  fontSize: '1.1rem',
  fontWeight: '800',
  color: '#f43f5e'
};

const canvasStyle = {
  display: 'block',
  border: '2px solid rgba(99, 102, 241, 0.6)',
  borderRadius: '12px',
  background: '#090d16',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  touchAction: 'none' // Prevents mobile scrolling interference when dragging paddle
};