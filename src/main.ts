import { Ball } from './Ball';
import { Stick } from './Stick';
import { createHiDPICanvas } from './helpers';
import './style.css';

interface Brick {
  x: number;
  y: number;
  status: number;
}

/* Create Arcade game */
let width = 1000;
console.log(window.innerWidth);
if (window.innerWidth < 600) {
  width = window.innerWidth;
}

let gameOver = false;
const canvas = createHiDPICanvas(width, window.innerHeight);
const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const bgColor = '#2C3333';
const scoreColor = '#E7F6F2';
const bricksColor = '#A5C9CA';

const stick = new Stick(canvasWidth, canvasHeight);
const ball = new Ball(stick.getX() + stick.getWidth() / 2, stick.getY() - 11);

/* BRICKS VARIABLES */
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 150;
const brickHeight = 50;
const brickPadding = 3;
const brickOffsetTop = 30;
// const brickOffsetLeft = 30;
const bricks: Brick[][] = [];
const extraSpace = width - (brickColumnCount * (brickWidth + brickPadding)) - brickPadding;
const brickOffsetLeft = extraSpace / 2;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// draw bricks
function drawBricks() {
  // draw bricks on the center of the canvas
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = bricksColor;
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBG() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawUI() {
  ctx.fillText(`FPS: ${framesPerSec}`, 5, 10);
}

function checkCollision() {
  const bottomBall = ball.getY() + ball.getRadius();
  const lefBall = ball.getX() - ball.getRadius();
  const rightBall = ball.getX() + ball.getRadius();
  const topStick = stick.getY() - stick.getHeight() / 2;
  const leftStick = stick.getX();
  const rightStick = stick.getX() + stick.getWidth();

  if (leftStick <= rightBall && lefBall <= rightStick && bottomBall > topStick) {
    // add angle to the ball
    const middleStick = stick.getX() + stick.getWidth() / 2;
    const angle = (ball.getX() - middleStick) / stick.getWidth();
    ball.setDx(20 * angle);
    ball.setDy(-ball.getDy());
  } else if (bottomBall > canvasHeight) {
    alert('GAME OVER');
    document.location.reload();
    gameOver = true;
  }

  // check collision with bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ball.getX() > brick.x &&
          ball.getX() < brick.x + brickWidth &&
          ball.getY() > brick.y &&
          ball.getY() < brick.y + brickHeight
        ) {
          ball.setDy(-ball.getDy());
          brick.status = 0;
        }
      }
    }
  }
}

// a que velocidad de fps queremos que renderice nuestro juego
const fps = 60;

let msPrev = window.performance.now();
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps;
let frames = 0;
let framesPerSec = fps;

function draw() {
  if (gameOver) return;
  window.requestAnimationFrame(draw);

  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  msPrev = msNow - excessTime;
  frames++;
  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000;
    framesPerSec = frames;
    frames = 0;
  }

  cleanCanvas();

  drawBG();
  stick.draw(ctx);
  ball.draw(ctx);
  drawBricks();
  drawUI();

  stick.moveStick(canvasWidth);
  ball.moveBall(canvasWidth);

  checkCollision();
}

draw();
