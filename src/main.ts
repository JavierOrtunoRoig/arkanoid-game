import { Ball } from './Ball';
import { Canvas } from './Canvas';
import { Level } from './Level';
import { Vaus } from './Vaus';
import { XboxController } from './XboxController';
import { $ } from './helpers';
import './style.css';

let gameOver = false;
let score = 0;

let width = 480;
if (window.innerWidth < 480) {
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
  const canvas = new Canvas(width);
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  const vaus = new Vaus(canvas.getCtx(), canvasWidth, canvasHeight);
  const ball = new Ball(vaus.getX() + vaus.getWidth() / 2, vaus.getY() - 11);
  const xboxGamepad = new XboxController(vaus);
  const level = new Level();

  // if (window.innerWidth < 480) {
  //   level = new Level(60, 20);
  // } else {
  //   level = new Level(width);
  // }

  function draw() {
    if (gameOver) return;
    window.requestAnimationFrame(draw);

    const msNow = window.performance.now();
    const msPassed = msNow - canvas.getmsPrev();

    if (msPassed < canvas.getmsPerFrame()) return;

    canvas.calculateFPS(msPassed, msNow);
    xboxGamepad.controllerInput();

    canvas.cleanCanvas();
    vaus.draw(canvas.getCtx());
    ball.draw(canvas.getCtx());
    level.draw(canvas.getCtx());
    canvas.drawUI(canvas.getFramesPerSec(), score);

    vaus.moveStick(canvasWidth);
    ball.moveBall(canvasWidth);

    checkCollision();
  }

  function checkCollision() {
    const bottomBall = ball.getY() + ball.getRadius();
    const lefBall = ball.getX() - ball.getRadius();
    const rightBall = ball.getX() + ball.getRadius();
    const topStick = vaus.getY() - vaus.getHeight() / 2;
    const leftStick = vaus.getX();
    const rightStick = vaus.getX() + vaus.getWidth();

    if (
      leftStick <= rightBall &&
      lefBall <= rightStick &&
      bottomBall > topStick
    ) {
      // Calculate the hit position relative to the width of the vaus
      const hitPosition = (ball.getX() - leftStick) / vaus.getWidth();

      // Define the maximum angle deviation you want
      const maxAngleDeviation = Math.PI / 3; // 60 degrees

      // Calculate the angle within the allowed deviation
      const angle = maxAngleDeviation * (2 * hitPosition - 1);

      // Apply the angle to the velocity components
      const speed = Math.sqrt(
        ball.getDx() * ball.getDx() + ball.getDy() * ball.getDy()
      );
      ball.setDx(speed * Math.sin(angle));
      ball.setDy(-speed * Math.cos(angle));
    } else if (bottomBall > canvasHeight) {
      gameOver = true;
      mainThemeAudio.pause();
      mainThemeAudio.currentTime = 0;
      gameOverAudio.play();
      alert(`GAME OVER. Your score is: ${score}`);
      document.location.reload();
    }

    // check collision with blocks
    for (let c = 0; c < level.getBrickColumnCount(); c++) {
      for (let r = 0; r < level.getBrickRowCount(); r++) {
        const block = level.getBrick(c, r);
        if (block.getStatus() === 1) {
          if (
            ball.getX() > block.getX() &&
            ball.getX() < block.getX() + level.getBrickWidth() &&
            ball.getY() > block.getY() &&
            ball.getY() < block.getY() + level.getBrickHeight()
          ) {
            ball.setDy(-ball.getDy());
            block.setStatus(0);
            score++;
          }
        }
      }
    }
  }

  draw();
};
