import { EDirection } from '@/pages/game-world/contants/control';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

export class Controls {
	input: Phaser.Input.InputPlugin;
	cursorKeys:
		| {
				up: Phaser.Input.Keyboard.Key;
				down: Phaser.Input.Keyboard.Key;
				left: Phaser.Input.Keyboard.Key;
				right: Phaser.Input.Keyboard.Key;
				w?: Phaser.Input.Keyboard.Key;
				s?: Phaser.Input.Keyboard.Key;
				a?: Phaser.Input.Keyboard.Key;
				d?: Phaser.Input.Keyboard.Key;
				c?: Phaser.Input.Keyboard.Key;
		  }
		| undefined;
	lastDirection: EDirection;
	public joystick?: VirtualJoystick;

	constructor(input: Phaser.Input.InputPlugin) {
		this.input = input;

		this.cursorKeys = input.keyboard?.createCursorKeys();
		if (this.cursorKeys) {
			this.cursorKeys.w = this.input.keyboard?.addKey('W', false);
			this.cursorKeys.a = this.input.keyboard?.addKey('A', false);
			this.cursorKeys.s = this.input.keyboard?.addKey('S', false);
			this.cursorKeys.d = this.input.keyboard?.addKey('D', false);
			this.cursorKeys.c = this.input.keyboard?.addKey('C', false);
		}

		this.lastDirection = EDirection.LEFT;

		input.setTopOnly(true);
	}

	computed() {
		const space = this.input.keyboard?.addKey('SPACE');
		const attack = this.input.keyboard?.addKey('C');
		const left =
			(this.cursorKeys?.left.isDown || this.cursorKeys?.a?.isDown) ?? false;
		const right =
			(this.cursorKeys?.right.isDown || this.cursorKeys?.d?.isDown) ?? false;
		const up =
			(this.cursorKeys?.up.isDown || this.cursorKeys?.w?.isDown) ?? false;
		const down =
			(this.cursorKeys?.down.isDown || this.cursorKeys?.s?.isDown) ?? false;

		const movementAngle = this._keysToAngle(left, right, up, down);
		let direction: EDirection = EDirection.LEFT;
		let isMoving = false;
		let isJumping = false;
		let isAttacking = false;

		if (movementAngle !== undefined) {
			isMoving = true;
			if (Math.abs(movementAngle) !== 90) {
				direction =
					Math.abs(movementAngle) > 90 ? EDirection.LEFT : EDirection.RIGHT;
				this.lastDirection = direction;
			} else if (movementAngle === 90) {
				direction = EDirection.UP;
			} else if (movementAngle === -90) {
				direction = EDirection.DOWN;
			}
		} else {
			direction = this.lastDirection;
			isMoving = false;
		}

		if (space?.isDown) {
			isJumping = true;
		}

		if (attack?.isDown) {
			isAttacking = true;
		}

		return {
			direction,
			movementAngle,
			isJumping,
			isMoving,
			isAttacking,
		};
	}

	onPressChat() {
		const X = this.input.keyboard?.addKey('X');

		return !!X?.isDown;
	}

	_keysToAngle(
		left: boolean,
		right: boolean,
		up: boolean,
		down: boolean,
	): number | undefined {
		// calculate the x and y components based on key states
		const x = (right ? 1 : 0) - (left ? 1 : 0);
		const y = (down ? 1 : 0) - (up ? 1 : 0);

		if (x === 0 && y === 0) {
			return undefined;
		}

		return (Math.atan2(y, x) * 180) / Math.PI;
	}
}
