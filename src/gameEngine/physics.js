// frontend/src/gameEngine/physics.js

// Line/Circle to Rectangle collision detection for bricks
export const checkBallBrickCollision = (ball, brick) => {
  const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width));
  const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height));

  const distanceX = ball.x - closestX;
  const distanceY = ball.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  if (distanceSquared < ball.radius * ball.radius) {
    const overlapX = ball.radius - Math.abs(distanceX);
    const overlapY = ball.radius - Math.abs(distanceY);

    if (overlapX < overlapY) {
      return { collided: true, axis: 'x' };
    } else {
      return { collided: true, axis: 'y' };
    }
  }
  return { collided: false };
};

// Calculate aiming trajectory line with wall bounce prediction
export const calculateTrajectory = (startX, startY, angle, maxBounces = 2, canvasWidth, canvasHeight) => {
  const points = [{ x: startX, y: startY }];
  let currentX = startX;
  let currentY = startY;
  let dirX = Math.cos(angle);
  let dirY = Math.sin(angle);
  const step = 10;
  let bounces = 0;

  for (let i = 0; i < 150 && bounces < maxBounces; i++) {
    currentX += dirX * step;
    currentY += dirY * step;

    // Bounce off left/right side walls
    if (currentX <= 10 || currentX >= canvasWidth - 10) {
      dirX = -dirX;
      bounces++;
    }

    // Stop at top wall or bottom boundary
    if (currentY <= 10 || currentY >= canvasHeight - 20) {
      points.push({ x: currentX, y: currentY });
      break;
    }

    points.push({ x: currentX, y: currentY });
  }

  return points;
};