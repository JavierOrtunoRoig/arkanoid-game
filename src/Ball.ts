
export class Ball {
  #color = '#FFF';
  #radius = 10;
  #X: number;
  #Y: number;
  #dx = 10;
  #dy = -10;

  constructor(x: number, y: number) {
    this.#X = x;
    this.#Y = y;
  }

  getX() {
    return this.#X;
  }

  setX(x: number) {
    this.#X = x;
  }

  getY() {
    return this.#Y;
  }

  setY(y: number) {
    this.#Y = y;
  }

  getRadius() {
    return this.#radius;
  }

  getDx() {
    return this.#dx;
  }

  setDx(dx: number) {
    this.#dx = dx;
  }

  getDy() {
    return this.#dy;
  }

  setDy(dy: number) {
    this.#dy = dy;
  }

  moveBall(canvasWidth: number) {
    if (this.#X + this.#dx > canvasWidth - this.#radius || this.#X + this.#dx < this.#radius) {
      this.#dx *= -1;
    }
    if (this.#Y + this.#dy < this.#radius) {
      this.#dy *= -1;
    }

    this.#X += this.#dx;
    this.#Y += this.#dy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.#color;
    ctx.beginPath();
    ctx.arc(this.#X, this.#Y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
