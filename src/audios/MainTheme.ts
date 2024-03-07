import { AbstractAudio } from './Audio';

const mainThemeQuery = '#main-theme';

export class MainThemeAudio extends AbstractAudio {
  constructor() {
    super(mainThemeQuery);
    this.audio.volume = 0.5;

    this.#setEvents();
  }

  #setEvents() {
    document.addEventListener('keydown', () => {
      this.audio.play();
      this.audio.loop = true;
    });

    document.addEventListener('click', () => {
      this.audio.play();
      this.audio.loop = true;
    });
  }
}
