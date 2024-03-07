import { Game } from './Game';
import { $ } from './helpers';
import './style.css';

const startButton = $('#start-button') as HTMLButtonElement;

startButton.addEventListener('click', () => {
  startButton.parentElement?.remove();
  const game = new Game();
  game.runGame();
});

function startGame(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    startButton.click();
    document.removeEventListener('keydown', startGame);
  }
}
document.addEventListener('keydown', startGame);
