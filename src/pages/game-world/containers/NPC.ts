import {
	ERobotNPCKey,
	getRobotNPCKey,
	NPC_KEYS,
	NPC_SPRITE_SHEETS,
} from '../contants/npc';
import { EDirection } from '@/pages/game-world/contants/control';
import Phaser from 'phaser';
import { Popup } from '@/pages/game-world/containers/Popup.ts';

export type TNPCContainerProps = {
	scene: Phaser.Scene;
	x: number;
	y: number;
	name?: string;
	direction?: EDirection;
	onClick?: () => void;
};

export class NPC extends Phaser.GameObjects.Container {
	direction: EDirection = EDirection.LEFT;
	sprite: Phaser.GameObjects.Sprite | undefined;
	popup?: Popup;

	constructor({ scene, x, y, direction }: TNPCContainerProps) {
		console.log(x, y);
		super(scene, x, y);
		this.scene = scene;
		this.direction = direction ?? EDirection.LEFT;
		scene.physics.add.existing(this);

		this._loadSprite(scene);
		scene.add.existing(this);
	}

	public idle() {
		const key = getRobotNPCKey(this.direction);

		if (this.sprite?.anims && this.sprite.anims.getName() !== key) {
			try {
				this.sprite?.setOrigin(0.5, 0.5);
				this.sprite.anims.play({ key, repeat: -1 }, true);
			} catch (e) {
				console.log('NPC Container: Error playing idle animation: ', e);
			}
		}
	}

	_loadSprite(scene: Phaser.Scene) {
		// npc sprite and animation load
		const isLoadedNPC = NPC_KEYS.every(key => scene.textures.exists(key));

		if (isLoadedNPC) {
			this._createNPCSprite();
		} else {
			for (const sheet of NPC_SPRITE_SHEETS) {
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
					if (key === ERobotNPCKey.IDLE_LEFT) {
						this._createNPCSprite();
					}
					this._createNPCAnimation(
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

	_createNPCSprite() {
		const idleSpriteLeftKey = getRobotNPCKey(this.direction);

		const idle = this.scene.add.sprite(0, 0, idleSpriteLeftKey);
		this.add(idle);
		this.sprite = idle;

		this.direction = EDirection.LEFT;
		this.idle();
	}

	_createNPCAnimation(
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

	public addOnClick(onClick: () => void) {
		const body = this.body as Phaser.Physics.Arcade.Body;
		this.setInteractive(
			new Phaser.Geom.Rectangle(
				body?.offset.x,
				body?.offset.y,
				body.width,
				body.height,
			),
			Phaser.Geom.Rectangle.Contains,
		).on('pointerdown', (p: Phaser.Input.Pointer) => {
			if (p.downElement.nodeName === 'CANVAS') {
				onClick();
			}
		});
	}

	public shutUp() {
		if (this.popup?.visible) {
			this.popup?.destroy();
			this.popup = undefined;
		}
	}

	public speak(text: string) {
		if (!this.popup?.visible) {
			this.popup = new Popup(this.scene, text, 'left');
			const body = this.body as Phaser.Physics.Arcade.Body;
			this.popup.setPosition(
				body.offset.x + body.width / 2 - 30,
				body.offset.y - body.height / 2 - 5,
			);
			this.add(this.popup);
		}
	}
}
