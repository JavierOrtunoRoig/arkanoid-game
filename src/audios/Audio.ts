// abstracts class Audio with play and pause methods

export abstract class AbstractAudio {
  audio: HTMLAudioElement;

  constructor(query: string) {
    this.audio = document.querySelector(query) as HTMLAudioElement;
    this.audio.volume = 0.5;
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
