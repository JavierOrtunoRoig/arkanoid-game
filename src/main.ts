import { Ball } from './Ball';
import { Canvas } from './Canvas';
import { Level } from './Level';
import { Stick } from './Stick';
import { XboxController } from './XboxController';
import { $ } from './helpers';
import './style.css';

let gameOver = false;
let score = 0;

let width = 1000;
if (window.innerWidth < 600) {
  width = window.innerWidth;
}

const startButton = $('#start-button') as HTMLButtonElement;
startButton.addEventListener('click', () => {
  startButton.parentElement?.remove();
  runGame();
});

const mainThemeAudio = $('#main-theme') as HTMLAudioElement;
mainThemeAudio.volume = 0.5;

document.addEventListener('keydown', () => {
  mainThemeAudio.play();
  mainThemeAudio.loop = true;
});

document.addEventListener('click', () => {
  mainThemeAudio.play();
  mainThemeAudio.loop = true;
});

const gameOverAudio = $('#game-over') as HTMLAudioElement;
gameOverAudio.volume = 0.5;

const runGame = () => {
  const canvas = new Canvas(width, window.innerHeight);
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  const stick = new Stick(canvasWidth, canvasHeight);
  const ball = new Ball(stick.getX() + stick.getWidth() / 2, stick.getY() - 11);
  const xboxGamepad = new XboxController(stick);
  let level: Level;

  if (window.innerWidth < 600) {
    level = new Level(window.innerWidth, 60, 20);
  } else {
    level = new Level(width);
  }

  function draw() {
    if (gameOver) return;
    window.requestAnimationFrame(draw);

    const msNow = window.performance.now();
    const msPassed = msNow - canvas.getmsPrev();

    if (msPassed < canvas.getmsPerFrame()) return;

    canvas.calculateFPS(msPassed, msNow);
    xboxGamepad.controllerInput();

    canvas.cleanCanvas();
    canvas.drawBG();
    stick.draw(canvas.getCtx());
    ball.draw(canvas.getCtx());
    level.draw(canvas.getCtx());
    canvas.drawUI(canvas.getFramesPerSec(), score);

    stick.moveStick(canvasWidth);
    ball.moveBall(canvasWidth);

    checkCollision();
  }

  function checkCollision() {
    const bottomBall = ball.getY() + ball.getRadius();
    const lefBall = ball.getX() - ball.getRadius();
    const rightBall = ball.getX() + ball.getRadius();
    const topStick = stick.getY() - stick.getHeight() / 2;
    const leftStick = stick.getX();
    const rightStick = stick.getX() + stick.getWidth();

    if (
      leftStick <= rightBall &&
      lefBall <= rightStick &&
      bottomBall > topStick
    ) {
      // add angle to the ball
      const middleStick = stick.getX() + stick.getWidth() / 2;
      const angle = (ball.getX() - middleStick) / stick.getWidth();
      ball.setDx(20 * angle);
      ball.setDy(-ball.getDy());
    } else if (bottomBall > canvasHeight) {
      gameOver = true;
      mainThemeAudio.pause();
      mainThemeAudio.currentTime = 0;
      gameOverAudio.play();
      alert(`GAME OVER. Your score is: ${score}`);
      document.location.reload();
    }

    // check collision with bricks
    for (let c = 0; c < level.getBrickColumnCount(); c++) {
      for (let r = 0; r < level.getBrickRowCount(); r++) {
        const brick = level.getBrick(c, r);
        if (brick.getStatus() === 1) {
          if (
            ball.getX() > brick.getX() &&
            ball.getX() < brick.getX() + level.getBrickWidth() &&
            ball.getY() > brick.getY() &&
            ball.getY() < brick.getY() + level.getBrickHeight()
          ) {
            ball.setDy(-ball.getDy());
            brick.setStatus(0);
            score++;
          }
        }
      }
    }
  }

  draw();
};
