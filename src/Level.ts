import { Block } from './Block';
import { CanvasRenderingContext2D } from './Canvas';

export class Level {
  #blocks: Block[][] = [];
  #brickRowCount = 5;
  #brickColumnCount = 11;
  #brickOffsetLeft: number;
  #brickWidth;
  #brickHeight;
  #brickOffsetTop = 64;
  // const brickOffsetLeft = 30;

  constructor(brickWidth = 32, brickHeight = 16) {
    this.#brickWidth = brickWidth;
    this.#brickHeight = brickHeight;
    // this.#brickOffsetLeft = this.#extraSpace / 2;
    this.#brickOffsetLeft = 64; // dos bloques de 32px

    for (let c = 0; c < this.#brickColumnCount; c++) {
      this.#blocks[c] = [];
      for (let r = 0; r < this.#brickRowCount; r++) {
        const brickX = c * this.#brickWidth + this.#brickOffsetLeft;
        const brickY = r * this.#brickHeight + this.#brickOffsetTop;
        this.#blocks[c][r] = new Block(brickX, brickY, 1);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let c = 0; c < this.#brickColumnCount; c++) {
      for (let r = 0; r < this.#brickRowCount; r++) {
        if (this.#blocks[c][r].getStatus() === 1) {
          this.#blocks[c][r].draw(ctx);
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
    return this.#blocks[c][r];
  }

  getBrickWidth() {
    return this.#brickWidth;
  }

  getBrickHeight() {
    return this.#brickHeight;
  }
}
