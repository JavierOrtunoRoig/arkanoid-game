import { AbstractAudio } from './Audio';

const gameOverQuery = '#game-over';

export class GameOverAudio extends AbstractAudio {
  constructor() {
    super(gameOverQuery);
    this.audio.volume = 0.5;
  }
}
