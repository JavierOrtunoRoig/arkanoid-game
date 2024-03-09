import { Canvas, CanvasRenderingContext2D } from './Canvas';
import { Lives } from './Lives';

interface Sprite {
  src: string;
  width: number;
  height: number;
}

const SPRITES: Sprite[] = [
  {
    src: '/Vaus_break.png',
    width: 32,
    height: 8
  },
  {
    src: '/Vaus.png',
    width: 32,
    height: 8
  },
  {
    src: '/Vaus_large.png',
    width: 48,
    height: 8
  }
];

const bottomOffset = 16;

export class Vaus {
  #velocity = 5;
  #moveLeft = false;
  #moveRight = false;
  #x: number;
  #y: number;
  #image: HTMLImageElement;
  #lives: Lives = Lives.getInstance();
  #canvas: Canvas;
  #onMouseMoveHandler = this.#onMouseMove.bind(this);

  constructor(
    canvas: Canvas,
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.#canvas = canvas;
    this.#x = (canvasWidth - this.getWidth()) / 2;
    this.#y = canvasHeight - this.getHeight() - bottomOffset;
    this.setEvents();
    this.#image = new Image();
    this.#image.src = this.#getActualSprite().src;
    this.#image.onload = () => {
      // draw the image only after it has been loaded correctly
      this.draw(ctx);
    };
  }

  setEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        this.#moveRight = true;
      } else if (event.key === 'ArrowLeft') {
        this.#moveLeft = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'ArrowRight') {
        this.#moveRight = false;
      } else if (event.key === 'ArrowLeft') {
        this.#moveLeft = false;
      }
    });

    document.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];

      // if use touche the screen then move the stick keeping the touch position
      if (
        touch.clientX > this.getWidth() / 2 &&
        touch.clientX < window.innerWidth - this.getWidth() / 2
      ) {
        this.#x = touch.clientX - this.getWidth() / 2;
      }
    });

    // get actual position of the mouse in the canvas and move the stick to left or right
    document.addEventListener('mousemove', this.#onMouseMoveHandler);
  }

  #onMouseMove(event: MouseEvent) {
    const { left, right } = this.#canvas.getElementPosition();
    const mouseX = event.clientX - left;
    const isMouseXInCanvas =
      mouseX > this.getWidth() / 2 && mouseX < right - this.getWidth() / 2;
    const vausIsNotOverflowing = event.clientX < right - this.getWidth() / 2;
    if (isMouseXInCanvas && vausIsNotOverflowing) {
      this.#x = mouseX - this.getWidth() / 2;
    }
  }

  removeEvents() {
    document.removeEventListener('mousemove', this.#onMouseMoveHandler);
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getWidth() {
    return this.#getActualSprite().width;
  }

  getHeight() {
    return this.#getActualSprite().height;
  }

  moveStick(canvasWidth: number) {
    if (this.#moveLeft && this.#x > 10) {
      this.#x -= this.#velocity;
    } else if (
      this.#moveRight &&
      this.#x + this.getWidth() < canvasWidth - 10
    ) {
      this.#x += this.#velocity;
    }
  }

  setMoveLeft(value: boolean) {
    this.#moveLeft = value;
  }

  setMoveRight(value: boolean) {
    this.#moveRight = value;
  }

  #getActualSprite() {
    return SPRITES[this.#lives.getLives() - 1];
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.#image.src !== this.#getActualSprite().src) {
      this.#image.src = this.#getActualSprite().src;
    }
    ctx.drawImage(
      this.#image,
      this.#x,
      this.#y,
      this.getWidth(),
      this.getHeight()
    );
  }
}
