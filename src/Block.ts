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
  #isSilver;
  #isGold;

  constructor(x: number, y: number, status: number) {
    this.#x = x;
    this.#y = y;
    this.#status = status;
    this.#$blocks = $('blocks') as unknown as HTMLImageElement;
    // get random block from 10 of the sprite
    this.#blockNumber = Math.floor(Math.random() * NUMBER_OF_BLOCKS_IN_SPRITE);
    this.#isSilver = this.#blockNumber === 8;
    this.#isGold = this.#blockNumber === 9;
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

  /**
   * Hit the block, change the status and return the number of bricks on the level
   * @param numberOfBricks - number of bricks on the level
   * @returns number of bricks on the level after the hit
   */
  hit(numberOfBricks: number) {
    if (this.#isGold) {
      this.#blockNumber = 8;
      this.#isGold = false;
      this.#isSilver = true;
    } else if (this.#isSilver) {
      this.#blockNumber = Math.floor(Math.random() * 8);
      this.#isSilver = false;
    } else {
      this.#status = 0;
      numberOfBricks--;
    }
    return numberOfBricks;
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
