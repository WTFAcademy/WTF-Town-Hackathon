import {
	EPlayerAction,
	EPlayerKey,
	getPlayerKey,
	PLAYER_KEYS,
	PLAYER_SPRITE_SHEETS,
} from '../contants/player';
import { EDirection } from '@/pages/game-world/contants/control';

export type TPlayerContainerProps = {
	scene: Phaser.Scene;
	x: number;
	y: number;
	name?: string;
	direction?: EDirection;
	onClick?: () => void;
};

export class Player extends Phaser.GameObjects.Container {
	direction: EDirection = EDirection.LEFT;
	lastHorizontalDirection: EDirection = EDirection.LEFT;

	silhouette: Phaser.GameObjects.Sprite | undefined;
	sprite: Phaser.GameObjects.Sprite | undefined;

	private _lockAnimation: string | undefined;
	private _isActivated: boolean = true;

	get isActivated() {
		return this._isActivated;
	}

	get lockAnimation() {
		return this._lockAnimation;
	}

	constructor({ scene, x, y, direction }: TPlayerContainerProps) {
		super(scene, x, y);
		this.scene = scene;
		this.direction = direction ?? EDirection.LEFT;
		scene.physics.add.existing(this);

		this.silhouette = scene.add.sprite(0, 0, 'silhouette');
		this.add(this.silhouette);
		this.sprite = this.silhouette;

		this._loadSprite(scene);
		scene.add.existing(this);
	}

	public walk() {
		if (!this._isActivated) {
			return;
		}

		const playerAnimationKey = getPlayerKey(
			EPlayerAction.WALKING,
			this.direction,
		);

		if (
			this.direction === EDirection.RIGHT ||
			this.direction === EDirection.LEFT
		) {
			// 增加攻击或跳跃的转向流畅性
			if (this.lastHorizontalDirection !== this.direction) {
				this._lockAnimation = undefined;
			}

			this.lastHorizontalDirection = this.direction;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== playerAnimationKey &&
			this.sprite.anims.getName() !== this._lockAnimation
		) {
			try {
				this.sprite?.setOrigin(0.5, 0.5);
				this.sprite.anims.play({ key: playerAnimationKey, repeat: -1 }, true);
			} catch (e) {
				console.error('Player Container: Error playing walk animation: ', e);
			}
		}
	}

	public idle() {
		const key = getPlayerKey(EPlayerAction.IDLE, this.direction);

		if (
			this.direction === EDirection.RIGHT ||
			this.direction === EDirection.LEFT
		) {
			// 增加攻击或跳跃的转向流畅性
			if (this.lastHorizontalDirection !== this.direction) {
				this._lockAnimation = undefined;
			}

			this.lastHorizontalDirection = this.direction;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this._lockAnimation
		) {
			try {
				this.sprite?.setOrigin(0.5, 0.5);
				this.sprite.anims.play({ key, repeat: -1 }, true);
			} catch (e) {
				console.log('Player Container: Error playing idle animation: ', e);
			}
		}
	}

	public jump(isMoving?: boolean) {
		if (!this._isActivated) {
			return;
		}

		const key = getPlayerKey(EPlayerAction.JUMP, this.direction);
		const nextKey = getPlayerKey(
			isMoving ? EPlayerAction.IDLE : EPlayerAction.WALKING,
			this.direction,
		);

		if (
			this.direction === EDirection.UP ||
			this.direction === EDirection.DOWN
		) {
			return;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this._lockAnimation
		) {
			try {
				this._lockAnimation = key;
				this.sprite?.setOrigin(0.5, 0.64);
				this.sprite.anims.play({ key, repeat: 0 }, true);

				this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
					this.sprite?.setOrigin(0.5, 0.5);
					this._lockAnimation = undefined;
					this.sprite?.anims.play({ key: nextKey, repeat: -1 }, true);
				});
			} catch (e) {
				console.log('Player Container: Error playing jump animation: ', e);
			}
		}
	}

	public attack(isMoving?: boolean) {
		if (!this._isActivated) {
			return;
		}

		const key = getPlayerKey(EPlayerAction.ATTACK, this.direction);
		const nextKey = getPlayerKey(
			isMoving ? EPlayerAction.IDLE : EPlayerAction.WALKING,
			this.direction,
		);

		if (
			this.direction === EDirection.UP ||
			this.direction === EDirection.DOWN
		) {
			return;
		}

		if (
			this.sprite?.anims &&
			this.sprite.anims.getName() !== key &&
			this.sprite.anims.getName() !== this._lockAnimation
		) {
			try {
				this._lockAnimation = key;
				this.sprite.anims.play({ key, repeat: 0 }, true);

				this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
					this._lockAnimation = undefined;
					this.sprite?.anims.play({ key: nextKey, repeat: -1 }, true);
				});
			} catch (e) {
				console.log('Player Container: Error playing attack animation: ', e);
			}
		}
	}

	public deactivate() {
		this._isActivated = false;
		this.idle();
	}

	public activate() {
		this._isActivated = true;
	}

	_loadSprite(scene: Phaser.Scene) {
		// player sprite and animation load
		const isLoadedPlayer = PLAYER_KEYS.every(key => scene.textures.exists(key));

		if (isLoadedPlayer) {
			this._createPlayerSprite();
		} else {
			for (const sheet of PLAYER_SPRITE_SHEETS) {
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
					if (key === EPlayerKey.IDLE_LEFT) {
						this._createPlayerSprite();
					}
					this._createPlayerAnimation(
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

	_createPlayerSprite() {
		const idleSpriteLeftKey = getPlayerKey(EPlayerAction.IDLE, this.direction);

		const idle = this.scene.add.sprite(0, 0, idleSpriteLeftKey);
		this.add(idle);
		this.sprite = idle;

		this.direction = EDirection.LEFT;
		this.idle();

		this.silhouette?.destroy();
	}

	_createPlayerAnimation(
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
