export class Brick {
  #x = -1;
  #y = -1;
  #status = -1;

  constructor(x: number, y: number, status: number) {
    this.#x = x;
    this.#y = y;
    this.#status = status;
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
}
