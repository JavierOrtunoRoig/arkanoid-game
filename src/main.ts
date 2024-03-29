import { Game } from './Game';
import { $ } from './helpers';
import './style.css';

const startButton = $('#start-button') as HTMLButtonElement;
let isPlayerReady = false;

startButton.addEventListener('click', () => {
  startButton.parentElement?.remove();
  const game = new Game();
  game.runGame();
  isPlayerReady = true;
});

function startGame(e: KeyboardEvent) {
  if (isPlayerReady) return;
  if (e.key === 'Enter' || e.key === ' ') {
    startButton.click();
    document.removeEventListener('keydown', startGame);
    isPlayerReady = true;
  }
}
document.addEventListener('keydown', startGame);
