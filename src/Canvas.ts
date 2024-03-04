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

export class Canvas {
  // #PIXEL_RATIO: number;
  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #bgColor = '#2C3333';
  #scoreColor = '#E7F6F2';
  #msPrev: number;
  #msPerFrame: number;
  #frames: number;
  #framesPerSec: number;
  #msFPSPrev: number;

  constructor(width: number, height: number) {
    this.#canvas = this.createHiDPICanvas(width, height);
    this.#ctx = this.#canvas.getContext(
      '2d'
    ) as unknown as CanvasRenderingContext2D;

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
    canvas.width = w; //* ratio;
    canvas.height = h; //* ratio;
    canvas.getContext('2d'); // ?.setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
  }

  cleanCanvas() {
    this.#ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
  }

  drawBG() {
    this.#ctx.fillStyle = this.#bgColor;
    this.#ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
  }

  drawUI(framesPerSec: number, score: number) {
    this.#ctx.fillStyle = this.#scoreColor;
    this.#ctx.font = '16px Arial';
    this.#ctx.fillText(`FPS: ${framesPerSec}`, 5, 20, 1000);
    this.#ctx.font = '18px Arial';
    this.#ctx.fillText(`Score: ${score}`, 5, 40, 1000);
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
}
