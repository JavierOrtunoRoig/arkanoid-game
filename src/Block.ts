import { CanvasRenderingContext2D } from './Canvas';
import { $ } from './helpers';

const NUMBER_OF_BLOCKS_IN_SPRITE = 10;
const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 16;

export class Block {
  #x = -1;
  #y = -1;
  #status = -1;
  #$blocks;
  #blockNumber;

  constructor(x: number, y: number, status: number) {
    this.#x = x;
    this.#y = y;
    this.#status = status;
    this.#$blocks = $('blocks') as unknown as HTMLImageElement;
    // get random block from 10 of the sprite
    this.#blockNumber = Math.floor(Math.random() * NUMBER_OF_BLOCKS_IN_SPRITE);
  }

  getX() {
    return this.#x;
  }

  setX(x: number) {
    this.#x = x;
  }

  getY() {
    return this.#y;
  }

  setY(y: number) {
    this.#y = y;
  }

  getStatus() {
    return this.#status;
  }

  setStatus(status: number) {
    this.#status = status;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.#$blocks) {
      this.#$blocks = document.querySelector(
        '#blocks'
      ) as unknown as HTMLImageElement;
    }
    if (!this.#$blocks) return;

    ctx.drawImage(
      this.#$blocks,
      this.#blockNumber * SPRITE_WIDTH,
      0,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.#x,
      this.#y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
  }
}
