import { Stick } from './Vaus';

export class XboxController {
  #gamepadConnected = false;
  #stick: Stick;
  /** If it's true then the movement has been reseted and we won't reset it again until controlled being used */
  #isCleaned = false;

  constructor(stick: Stick) {
    this.#setEvents();
    this.#stick = stick;
  }

  #setEvents() {
    window.addEventListener('gamepadconnected', (e) => {
      const event = e as GamepadEvent;
      console.log('gamepad connected', event.gamepad.id);
      this.#gamepadConnected = true;
    });
  }

  controllerInput() {
    if (!this.#gamepadConnected) return;

    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0] as Gamepad;

    if (gamepad.buttons[14].pressed) {
      this.#stick.setMoveLeft(true);
      this.#isCleaned = false;
    } else if (gamepad.axes[0] < -0.5) {
      this.#stick.setMoveLeft(true);
      this.#isCleaned = false;
    } else if (gamepad.buttons[15].pressed) {
      this.#stick.setMoveRight(true);
      this.#isCleaned = false;
    } else if (gamepad.axes[0] > 0.5) {
      this.#stick.setMoveRight(true);
      this.#isCleaned = false;
    } else if (!this.#isCleaned) {
      this.#stick.setMoveLeft(false);
      this.#stick.setMoveRight(false);
      this.#isCleaned = true;
    }
  }
}
