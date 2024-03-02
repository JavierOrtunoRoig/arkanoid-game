export class Stick {
  #color = '#395B64';
  #width = 100;
  #height = 10;
  #velocity = 10;
  #moveLeft = false;
  #moveRight = false;
  #x: number;
  #y: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.#x = (canvasWidth - this.#width) / 2;
    this.#y = canvasHeight - this.#height - 50;
    this.setEvents();
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
  }

  setX(value: number) {
    this.#x = value;
  }

  getX() {
    return this.#x;
  }

  setY(value: number) {
    this.#y = value;
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
    } else if (this.#moveRight &&  this.#x + this.#width < canvasWidth - 10) {
       this.#x += this.#velocity;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.#color;
    ctx.fillRect(this.#x, this.#y, this.#width, this.#height);
  }
}