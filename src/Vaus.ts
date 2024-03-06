import { CanvasRenderingContext2D } from './Canvas';

const SPRITE = '/Vaus.png';
const bottomOffset = 16;

export class Vaus {
  #width = 32;
  #height = 8;
  #velocity = 10;
  #moveLeft = false;
  #moveRight = false;
  #x: number;
  #y: number;
  #image: CanvasImageSource;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.#x = (canvasWidth - this.#width) / 2;
    this.#y = canvasHeight - this.#height - bottomOffset;
    this.setEvents();
    this.#image = new Image();
    this.#image.src = SPRITE;
    this.#image.onload = () => {
      // Dibujar la imagen solo después de que se haya cargado correctamente
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
        touch.clientX > this.#width / 2 &&
        touch.clientX < window.innerWidth - this.#width / 2
      ) {
        this.#x = touch.clientX - this.#width / 2;
      }
    });
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  moveStick(canvasWidth: number) {
    if (this.#moveLeft && this.#x > 10) {
      this.#x -= this.#velocity;
    } else if (this.#moveRight && this.#x + this.#width < canvasWidth - 10) {
      this.#x += this.#velocity;
    }
  }

  setMoveLeft(value: boolean) {
    this.#moveLeft = value;
  }

  setMoveRight(value: boolean) {
    this.#moveRight = value;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.#image, this.#x, this.#y, this.#width, this.#height);
  }
}
