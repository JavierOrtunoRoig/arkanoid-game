import { Ball } from './Ball';
import { Canvas } from './Canvas';
import { Level } from './Level';
import { Lives } from './Lives';
import { Vaus } from './Vaus';
import { XboxController } from './XboxController';
import { GameOverAudio } from './audios/GameOverQuery';
import { MainThemeAudio } from './audios/MainTheme';
import { $ } from './helpers';
import './style.css';

let gameOver = false;
let score = 0;

const startButton = $('#start-button') as HTMLButtonElement;
startButton.addEventListener('click', () => {
  startButton.parentElement?.remove();
  runGame();
});

const runGame = () => {
  const canvas = new Canvas();
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  const mainThemeAudio = new MainThemeAudio();
  const gameOverAudio = new GameOverAudio();

  const vaus = new Vaus(canvas.getCtx(), canvasWidth, canvasHeight);
  let ball = new Ball(vaus.getX() + vaus.getWidth() / 2, vaus.getY() - 11);
  const xboxGamepad = new XboxController(vaus);
  const level = new Level();

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

    const ballHitVaus =
      leftStick <= rightBall && lefBall <= rightStick && bottomBall > topStick;
    if (ballHitVaus) {
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
    } else if (bottomBall > topStick + 16) {
      const lives = Lives.getInstance();
      lives.decreaseLives();
      if (lives.getLives() === 0) {
        gameOver = true;
        mainThemeAudio.pause();
        gameOverAudio.play();
        alert(`GAME OVER. Your score is: ${score}`);
        document.location.reload();
      } else {
        ball = new Ball(vaus.getX() + vaus.getWidth() / 2, vaus.getY() - 11);
      }
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
