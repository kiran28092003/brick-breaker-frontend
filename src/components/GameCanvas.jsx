import React, { useRef, useEffect, useState } from 'react';

const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 450;

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
      // Speed multiplier increases with each level
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

  // Controls & Keyboard Listeners
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
            { x: paddle.x + 10, y: CANVAS_HEIGHT - 35, dy: -8 },
            { x: paddle.x + paddle.width - 10, y: CANVAS_HEIGHT - 35, dy: -8 }
          );
        }
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowRight', 'ArrowLeft', 'a', 'd'].includes(e.key)) {
        gameState.current.paddle.dx = 0;
      }
    };

    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
        gameState.current.paddle.x = relativeX - gameState.current.paddle.width / 2;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const canvasElement = canvasRef.current;
    if (canvasElement) canvasElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvasElement) canvasElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Main Game Animation Loop (Optimized dependencies)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const loop = () => {
      if (isPaused || gameOverTriggered) return;

      const { paddle, balls, bricks, powerUps, particles, lasers } = gameState.current;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // --- 1. Draw Paddle ---
      ctx.fillStyle = paddle.hasLaser ? '#f59e0b' : '#6366f1';
      ctx.shadowBlur = 10;
      ctx.shadowColor = paddle.hasLaser ? '#f59e0b' : '#6366f1';
      ctx.fillRect(paddle.x, CANVAS_HEIGHT - 30, paddle.width, paddle.height);
      ctx.shadowBlur = 0;

      // Laser Cannon Indicators
      if (paddle.hasLaser) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(paddle.x + 5, CANVAS_HEIGHT - 35, 6, 5);
        ctx.fillRect(paddle.x + paddle.width - 11, CANVAS_HEIGHT - 35, 6, 5);
      }

      paddle.x += paddle.dx;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.width > CANVAS_WIDTH) paddle.x = CANVAS_WIDTH - paddle.width;

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
        if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
          ball.dx *= -1;
          playSound('hit');
        }
        if (ball.y - ball.radius < 0) {
          ball.dy *= -1;
          playSound('hit');
        }

        // Paddle collision
        if (
          ball.y + ball.radius >= CANVAS_HEIGHT - 30 &&
          ball.x >= paddle.x &&
          ball.x <= paddle.x + paddle.width
        ) {
          ball.dy = -Math.abs(ball.dy);
          playSound('hit');
        }

        // Ball out of bounds
        if (ball.y + ball.radius > CANVAS_HEIGHT) {
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
              // Access current score state safely
              setScore((currentScore) => {
                onGameOver(currentScore);
                return currentScore;
              });
            }, 0);
          } else {
            // Respawn ball matching current level speed
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

        // Paddle catches Powerup
        if (
          p.y + 10 >= CANVAS_HEIGHT - 30 &&
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
              { x: paddle.x + 20, y: CANVAS_HEIGHT - 40, radius: 8, dx: -3, dy: -5 },
              { x: paddle.x + paddle.width - 20, y: CANVAS_HEIGHT - 40, radius: 8, dx: 3, dy: -5 }
            );
          } else if (p.type === 'LASER') {
            paddle.hasLaser = true;
          }
          powerUps.splice(i, 1);
        } else if (p.y > CANVAS_HEIGHT) {
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
    <div style={{ textAlign: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: 750, margin: '10px auto' }}>
        <h2>Score: {score}</h2>
        <h2>Level: {level}</h2>
        <h2>Lives: {lives}</h2>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '3px solid #6366f1', borderRadius: '8px', background: '#0f172a' }}
      />
    </div>
  );
}