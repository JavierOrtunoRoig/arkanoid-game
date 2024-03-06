// create a class Lives with methods to increase and decrease the number of lives and to get the value. It should be a singleton class.

// The class should have the following methods:
// - getLives(): number: returns the current number of lives.
// - increaseLives(): void: increases the number of lives by one.
// - decreaseLives(): void: decreases the number of lives by one.

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
