interface CanvasRenderingContext2D extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform, CanvasUserInterface {
  mozBackingStorePixelRatio: any;
  msBackingStorePixelRatio: any;
  oBackingStorePixelRatio: any;
  backingStorePixelRatio: any;
  webkitBackingStorePixelRatio: any;
  readonly canvas: HTMLCanvasElement;
}


export const $ = (selector: string) => document.querySelector(selector);
export const $$ = (selector: string) => document.querySelectorAll(selector);

export const calculatePixelRatio = (): number => {
  const canvas = $('#game') as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D, 
      dpr = window.devicePixelRatio || 1,
      bsr = ctx?.webkitBackingStorePixelRatio ||
            ctx?.mozBackingStorePixelRatio ||
            ctx?.msBackingStorePixelRatio ||
            ctx?.oBackingStorePixelRatio ||
            ctx?.backingStorePixelRatio || 1;

  return dpr / bsr;
}

const PIXEL_RATIO = calculatePixelRatio();


export const createHiDPICanvas = function(w: number, h: number, ratio: number = PIXEL_RATIO): HTMLCanvasElement {
  const canvas = $('#game') as HTMLCanvasElement;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
}