import { Lives } from './Lives';

export interface CanvasRenderingContext2D
  extends CanvasCompositing,
    CanvasDrawImage,
    CanvasDrawPath,
    CanvasFillStrokeStyles,
    CanvasFilters,
    CanvasImageData,
    CanvasImageSmoothing,
    CanvasPath,
    CanvasPathDrawingStyles,
    CanvasRect,
    CanvasShadowStyles,
    CanvasState,
    CanvasText,
    CanvasTextDrawingStyles,
    CanvasTransform,
    CanvasUserInterface {
  mozBackingStorePixelRatio: never;
  msBackingStorePixelRatio: never;
  oBackingStorePixelRatio: never;
  backingStorePixelRatio: never;
  webkitBackingStorePixelRatio: never;
  readonly canvas: HTMLCanvasElement;
}

const WIDTH = 480;
const HEIGHT = 480;

export class Canvas {
  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #textColor = '#E7F6F2';
  #msPrev: number;
  #msPerFrame: number;
  #frames: number;
  #framesPerSec: number;
  #msFPSPrev: number;
  #lives = Lives.getInstance();

  constructor() {
    this.#canvas = this.createHiDPICanvas(WIDTH, HEIGHT);
    this.#ctx = this.#canvas.getContext(
      '2d'
    ) as unknown as CanvasRenderingContext2D;

    this.#canvas.style.cursor = 'none';

    const fps = 60;

    this.#msPrev = window.performance.now();
    this.#msFPSPrev = window.performance.now() + 1000;
    this.#msPerFrame = 1000 / fps;
    this.#frames = 0;
    this.#framesPerSec = fps;
  }

  createHiDPICanvas(w: number, h: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d');
    return canvas;
  }

  cleanCanvas() {
    this.#ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
  }

  drawUI(framesPerSec: number, score: number) {
    this.#ctx.fillStyle = this.#textColor;
    this.#ctx.font = '12px Arial';
    this.#ctx.fillText(`FPS: ${framesPerSec}`, 5, 15);
    this.#ctx.fillText(`Score: ${score}`, 5, 30);
    this.#ctx.fillText(`Lives: ${this.#lives.getLives()}`, 5, 45);
  }

  calculateFPS(msPassed: number, msNow: number) {
    const excessTime = msPassed % this.#msPerFrame;
    this.#msPrev = msNow - excessTime;
    this.#frames++;
    if (this.#msFPSPrev < msNow) {
      this.#msFPSPrev = window.performance.now() + 1000;
      this.#framesPerSec = this.#frames;
      this.#frames = 0;
    }
  }

  getFramesPerSec() {
    return this.#framesPerSec;
  }

  getmsPerFrame() {
    return this.#msPerFrame;
  }

  getmsPrev() {
    return this.#msPrev;
  }

  getCanvas() {
    return this.#canvas;
  }

  getCtx() {
    return this.#ctx;
  }

  getWidth() {
    return this.#canvas.width;
  }

  getHeight() {
    return this.#canvas.height;
  }

  getElementPosition() {
    return this.#canvas.getBoundingClientRect();
  }
}
