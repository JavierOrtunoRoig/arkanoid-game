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

// Draw the background
ctx.fillStyle = bgColor;
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// Draw the stick
const stickWidth = 100;
const stickHeight = 10;
let stickX = (canvasWidth - stickWidth) / 2;
let stickY = canvasHeight - stickHeight - 50;
ctx.fillStyle = stickColor;
ctx.fillRect(stickX, stickY, stickWidth, stickHeight);