import { Stick } from './Stick';

export class XboxController {
  #gamepadConnected = false;
  #stick: Stick;

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

    // this.#checkDirectionButtons(gamepad);
    // this.#checkAxis(gamepad);

    if (gamepad.buttons[14].pressed) {
      this.#stick.setMoveLeft(true);
    } else if (gamepad.axes[0] < -0.5) {
      this.#stick.setMoveLeft(true);
    } else if (gamepad.buttons[15].pressed) {
      this.#stick.setMoveRight(true);
    } else if (gamepad.axes[0] > 0.5) {
      this.#stick.setMoveRight(true);
    } else {
      this.#stick.setMoveLeft(false);
      this.#stick.setMoveRight(false);
    }
  }
}
