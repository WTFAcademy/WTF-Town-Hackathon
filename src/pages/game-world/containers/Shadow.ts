import {
	EPlayerAction,
	EShadowKey,
	getShadowKey,
	SHADOW_KEYS,
	SHADOW_SPRITE_SHEETS,
} from '@/pages/game-world/contants/shadow.ts';

import { EDirection } from '@/pages/game-world/contants/control';

export type TShadowContainerProps = {
	scene: Phaser.Scene;
	x: number;
	y: number;
};

export class Shadow extends Phaser.GameObjects.Container {
	sprite: Phaser.GameObjects.Sprite | undefined;

	lockAnimation: string | undefined;

	direction: EDirection = EDirection.LEFT;
	lastHorizontalDirection: EDirection = EDirection.LEFT;

	constructor({ scene, x, y }: TShadowContainerProps) {
		super(scene, x, y);
		this.scene = scene;

		scene.physics.add.existing(this);

		this._loadSprite(scene);
		scene.add.existing(this);
	}

	public walk() {
		const key = getShadowKey(EPlayerAction.WALKING);

		if (
			this.direction === EDirection.RIGHT ||
			this.direction === EDirection.LEFT
		) {
			// 增加攻击或跳跃的转向流畅性
			if (this.lastHorizontalDirection !== this.direction) {
				this.lockAnimation = undefined;
			}

			this.lastHorizontalDirection = this.direction;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this.lockAnimation
		) {
			try {
				this.sprite.anims.play({ key, repeat: -1 }, true);
			} catch (e) {
				console.log('Shadow Container: Error playing idle animation: ', e);
			}
		}
	}

	public idle() {
		const key = getShadowKey(EPlayerAction.IDLE);

		if (
			this.direction === EDirection.RIGHT ||
			this.direction === EDirection.LEFT
		) {
			// 增加攻击或跳跃的转向流畅性
			if (this.lastHorizontalDirection !== this.direction) {
				this.lockAnimation = undefined;
			}

			this.lastHorizontalDirection = this.direction;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this.lockAnimation
		) {
			try {
				this.sprite.anims.play({ key, repeat: -1 }, true);
			} catch (e) {
				console.log('Shadow Container: Error playing idle animation: ', e);
			}
		}
	}

	public jump() {
		const key = getShadowKey(EPlayerAction.JUMP);
		const nextKey = getShadowKey(EPlayerAction.IDLE);

		if (
			this.direction === EDirection.UP ||
			this.direction === EDirection.DOWN
		) {
			return;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this.lockAnimation
		) {
			try {
				this.lockAnimation = key;
				this.sprite.anims.play({ key, repeat: 0 }, true);
				this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
					this.lockAnimation = undefined;
					this.sprite?.anims.play({ key: nextKey, repeat: -1 }, true);
				});
			} catch (e) {
				console.log('Shadow Container: Error playing jump animation: ', e);
			}
		}
	}

	public attack() {
		const key = getShadowKey(EPlayerAction.ATTACK, this.direction);
		const nextKey = getShadowKey(EPlayerAction.IDLE);

		if (
			this.direction === EDirection.UP ||
			this.direction === EDirection.DOWN
		) {
			return;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this.lockAnimation
		) {
			try {
				this.lockAnimation = key;
				this.sprite.anims.play({ key, repeat: 0 }, true);

				this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
					this.lockAnimation = undefined;
					this.sprite?.anims.play({ key: nextKey, repeat: -1 }, true);
				});
			} catch (e) {
				console.log('Player Container: Error playing attack animation: ', e);
			}
		}
	}

	_loadSprite(scene: Phaser.Scene) {
		// shadow sprite and animation load
		const isLoadedShadow = SHADOW_KEYS.every(key => scene.textures.exists(key));
		if (isLoadedShadow) {
			console.log('shadow sprite exists');
		} else {
			for (const sheet of SHADOW_SPRITE_SHEETS) {
				const {
					key,
					url,
					frameConfig,
					startFrame,
					endFrame,
					frameRate,
					repeat,
				} = sheet;
				const loader = scene.load.spritesheet(key, url, frameConfig);

				loader.on(Phaser.Loader.Events.COMPLETE, () => {
					if (key === EShadowKey.DEFAULT_SHADOW) {
						this._createShadowSprite();
					}
					this._createShadowAnimation(
						key,
						key,
						startFrame!,
						endFrame!,
						frameRate,
						repeat,
					);
					loader.removeAllListeners();
				});
			}
		}

		scene.load.start();
	}

	_createShadowSprite() {
		const idleShadowKey = getShadowKey(EPlayerAction.IDLE, 'left');
		const shadow = this.scene.add.sprite(0, 0.6, idleShadowKey);
		this.add(shadow);
		this.sprite = shadow;
		this.sprite.alpha = 0.7;
	}

	_createShadowAnimation(
		name: string,
		spriteSheetName: string,
		startFrame: number,
		endFrame: number,
		frameRate = 5,
		repeat = -1,
	) {
		this.scene.anims.create({
			key: name,
			frames: this.scene.anims.generateFrameNumbers(spriteSheetName, {
				start: startFrame,
				end: endFrame,
			}),
			frameRate: frameRate,
			repeat,
		});
	}
}
