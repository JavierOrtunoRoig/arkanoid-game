import { Ball } from './Ball';
import { Canvas } from './Canvas';
import { Level } from './Level';
import { Lives } from './Lives';
import { Vaus } from './Vaus';
import { XboxController } from './XboxController';
import { GameOverAudio } from './audios/GameOverQuery';
import { MainThemeAudio } from './audios/MainTheme';

export class Game {
  #canvas = new Canvas();
  #canvasWidth = this.#canvas.getWidth();
  #canvasHeight = this.#canvas.getHeight();
  #mainThemeAudio;
  #gameOverAudio;
  #vaus;
  #ball;
  #xboxGamepad;
  #level;
  #numberOfBricks = 55;

  #gameOver = false;
  #score = 0;

  constructor() {
    this.#mainThemeAudio = new MainThemeAudio();
    this.#gameOverAudio = new GameOverAudio();

    this.#vaus = new Vaus(
      this.#canvas,
      this.#canvas.getCtx(),
      this.#canvasWidth,
      this.#canvasHeight
    );
    this.#ball = new Ball(
      this.#vaus.getX() + this.#vaus.getWidth() / 2,
      this.#vaus.getY() - 11
    );
    this.#xboxGamepad = new XboxController(this.#vaus);
    this.#level = new Level();
  }

  runGame() {
    const draw = () => {
      if (this.#gameOver) return;
      window.requestAnimationFrame(draw);

      const msNow = window.performance.now();
      const msPassed = msNow - this.#canvas.getmsPrev();

      if (msPassed < this.#canvas.getmsPerFrame()) return;

      this.#canvas.calculateFPS(msPassed, msNow);
      this.#xboxGamepad.controllerInput();

      this.#canvas.cleanCanvas();
      this.#vaus.draw(this.#canvas.getCtx());
      this.#ball.draw(this.#canvas.getCtx());
      this.#level.draw(this.#canvas.getCtx());
      this.#canvas.drawUI(this.#canvas.getFramesPerSec(), this.#score);

      this.#vaus.moveStick(this.#canvasWidth);
      this.#ball.moveBall(this.#canvasWidth);

      checkCollision();
    };

    const checkCollision = () => {
      const bottomBall = this.#ball.getY() + this.#ball.getRadius();
      const lefBall = this.#ball.getX() - this.#ball.getRadius();
      const rightBall = this.#ball.getX() + this.#ball.getRadius();
      const topStick = this.#vaus.getY() - this.#vaus.getHeight() / 2;
      const leftStick = this.#vaus.getX();
      const rightStick = this.#vaus.getX() + this.#vaus.getWidth();

      const ballHitVaus =
        leftStick <= rightBall &&
        lefBall <= rightStick &&
        bottomBall > topStick;
      if (ballHitVaus) {
        ballCollisionWithVaus(leftStick);
      } else if (bottomBall > topStick + 16) {
        ballCollisionWithBottom();
      }

      ballCollisionWithBlocks();
    };

    const ballCollisionWithVaus = (leftStick: number) => {
      // Calculate the hit position relative to the width of the vaus
      const hitPosition =
        (this.#ball.getX() - leftStick) / this.#vaus.getWidth();

      // Define the maximum angle deviation you want
      const maxAngleDeviation = Math.PI / 3; // 60 degrees

      // Calculate the angle within the allowed deviation
      const angle = maxAngleDeviation * (2 * hitPosition - 1);

      // Apply the angle to the velocity components
      const speed = Math.sqrt(
        this.#ball.getDx() * this.#ball.getDx() +
          this.#ball.getDy() * this.#ball.getDy()
      );
      this.#ball.setDx(speed * Math.sin(angle));
      this.#ball.setDy(-speed * Math.cos(angle));
    };

    const ballCollisionWithBottom = () => {
      const lives = Lives.getInstance();
      lives.decreaseLives();
      if (lives.getLives() === 0) {
        loseGame();
      } else {
        this.#ball = new Ball(
          this.#vaus.getX() + this.#vaus.getWidth() / 2,
          this.#vaus.getY() - 11
        );
      }
    };

    const ballCollisionWithBlocks = () => {
      for (let c = 0; c < this.#level.getBrickColumnCount(); c++) {
        for (let r = 0; r < this.#level.getBrickRowCount(); r++) {
          const block = this.#level.getBrick(c, r);
          if (block.getStatus() === 1) {
            if (
              this.#ball.getX() + this.#ball.getRadius() > block.getX() &&
              this.#ball.getX() - this.#ball.getRadius() <
                block.getX() + this.#level.getBrickWidth() &&
              this.#ball.getY() + this.#ball.getRadius() > block.getY() &&
              this.#ball.getY() - this.#ball.getRadius() <
                block.getY() + this.#level.getBrickHeight()
            ) {
              this.#ball.setDy(-this.#ball.getDy());
              this.#numberOfBricks = block.hit(this.#numberOfBricks);
              this.#score++;
              if (this.#numberOfBricks === 0) {
                winGame();
              }
              return;
            }
          }
        }
      }
    };

    const winGame = () => {
      this.#gameOver = true;
      this.#mainThemeAudio.pause();
      document.body.removeChild(this.#canvas.getCanvas());

      const titlesContainer = document.createElement('div');
      titlesContainer.style.display = 'flex';
      titlesContainer.style.flexDirection = 'column';
      titlesContainer.style.justifyContent = 'center';
      titlesContainer.style.alignItems = 'center';

      const winTitle = document.createElement('h1');
      winTitle.innerText = 'YOU WON!';
      winTitle.style.color = 'cyan';
      titlesContainer.appendChild(winTitle);

      const score = document.createElement('h2');
      score.innerText = `Your score is: ${this.#score}`;
      score.style.color = 'cyan';
      titlesContainer.appendChild(score);

      document.body.appendChild(titlesContainer);
      this.#mainThemeAudio.pause();
      this.#vaus.removeEvents();
    };

    const loseGame = () => {
      this.#gameOver = true;
      this.#mainThemeAudio.pause();
      this.#gameOverAudio.play();

      document.body.removeChild(this.#canvas.getCanvas());

      const titlesContainer = document.createElement('div');
      titlesContainer.style.display = 'flex';
      titlesContainer.style.flexDirection = 'column';
      titlesContainer.style.justifyContent = 'center';
      titlesContainer.style.alignItems = 'center';

      const loseTitle = document.createElement('h1');
      loseTitle.innerText = 'GAME OVER!';
      loseTitle.style.color = 'cyan';
      titlesContainer.appendChild(loseTitle);

      const score = document.createElement('h2');
      score.innerText = `Your score is: ${this.#score}`;
      score.style.color = 'cyan';
      titlesContainer.appendChild(score);

      document.body.appendChild(titlesContainer);
      console.log('object');
      this.#vaus.removeEvents();
    };

    draw();
  }
}
