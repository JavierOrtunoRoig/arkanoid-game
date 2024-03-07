export class Lives {
  // eslint-disable-next-line no-use-before-define
  private static instance: Lives;
  private lives: number = 3;

  public static getInstance(): Lives {
    if (!Lives.instance) {
      Lives.instance = new Lives();
    }
    return Lives.instance;
  }

  public getLives(): number {
    return this.lives;
  }

  public increaseLives(): void {
    this.lives++;
  }

  public decreaseLives(): void {
    this.lives--;
  }
}
