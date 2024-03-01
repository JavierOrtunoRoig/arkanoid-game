import { createHiDPICanvas } from './helpers';
import './style.css'

/* Create Arcade game */
const canvas = createHiDPICanvas(1000, 1000)
const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const bgColor = '#2C3333';
const stickColor = '#395B64';
const scoreColor = '#E7F6F2';
const ballColor = '#FFF';
const bricks = '#A5C9CA';

/* STICK VARIABLES */
const stickWidth = 100;
const stickHeight = 10;
const stickVelocity = 20;
const stickY = canvasHeight - stickHeight - 50;
let stickX = (canvasWidth - stickWidth) / 2;

// add moving stick
document.addEventListener('keydown', function(event) {
  console.log(event);
  if (event.key === 'ArrowRight' && stickX + stickWidth < canvasWidth - 20) {
    stickX += stickVelocity;
  } else if (event.key === 'ArrowLeft' && stickX > 20) {
    stickX -= stickVelocity;
  }
});


function drawStick() {
  const stickWidth = 100;
  const stickHeight = 10;
  ctx.fillStyle = stickColor;
  ctx.fillRect(stickX, stickY, stickWidth, stickHeight);
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawBG() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawUI() {
  ctx.fillText(`FPS: ${framesPerSec}`, 5, 10)
}


// a que velocidad de fps queremos que renderice nuestro juego
const fps = 60
  
let msPrev = window.performance.now()
let msFPSPrev = window.performance.now() + 1000;
const msPerFrame = 1000 / fps
let frames = 0
let framesPerSec = fps;

function draw() {
  window.requestAnimationFrame(draw)

  const msNow = window.performance.now()
  const msPassed = msNow - msPrev;

  
  if (msPassed < msPerFrame) return
  
  const excessTime = msPassed % msPerFrame
  msPrev = msNow - excessTime
  
  frames++
  
  console.log({msFPSPrev, msNow});
  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000
    framesPerSec = frames;
    frames = 0;
  }

  cleanCanvas();
  drawBG();
  drawStick();
  drawUI()
}

draw()