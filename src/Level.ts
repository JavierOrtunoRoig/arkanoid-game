import { Brick } from './Brick';
import { CanvasRenderingContext2D } from './Canvas';

export class Level {
  #bricksColor = '#A5C9CA';
  #bricks: Brick[][] = [];
  #brickRowCount = 5;
  #brickColumnCount = 3;
  #extraSpace: number;
  #brickOffsetLeft: number;
  #brickWidth;
  #brickHeight;
  #brickPadding = 3;
  #brickOffsetTop = 30;
  // const brickOffsetLeft = 30;

  constructor(canvasWidth: number, brickWidth = 150, brickHeight = 50) {
    this.#brickWidth = brickWidth;
    this.#brickHeight = brickHeight;
    this.#extraSpace =
      canvasWidth -
      this.#brickColumnCount * (this.#brickWidth + this.#brickPadding) -
      this.#brickPadding;
    this.#brickOffsetLeft = this.#extraSpace / 2;

    for (let c = 0; c < this.#brickColumnCount; c++) {
      this.#bricks[c] = [];
      for (let r = 0; r < this.#brickRowCount; r++) {
        this.#bricks[c][r] = new Brick(0, 0, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let c = 0; c < this.#brickColumnCount; c++) {
      for (let r = 0; r < this.#brickRowCount; r++) {
        if (this.#bricks[c][r].getStatus() === 1) {
          const brickX =
            c * (this.#brickWidth + this.#brickPadding) + this.#brickOffsetLeft;
          const brickY =
            r * (this.#brickHeight + this.#brickPadding) + this.#brickOffsetTop;
          this.#bricks[c][r].setX(brickX);
          this.#bricks[c][r].setY(brickY);
          ctx.fillStyle = this.#bricksColor;
          ctx.fillRect(brickX, brickY, this.#brickWidth, this.#brickHeight);
        }
      }
    }
  }

  getBrickColumnCount() {
    return this.#brickColumnCount;
  }

  getBrickRowCount() {
    return this.#brickRowCount;
  }

  getBrick(c: number, r: number) {
    return this.#bricks[c][r];
  }

  getBrickWidth() {
    return this.#brickWidth;
  }

  getBrickHeight() {
    return this.#brickHeight;
  }
}
