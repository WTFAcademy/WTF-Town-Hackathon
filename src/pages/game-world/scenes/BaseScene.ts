import { Coordinates } from '@/types/common';
import { Player } from '../containers/Player';
import { Shadow } from '@/pages/game-world/containers/Shadow.ts';
import { SQUARE_WIDTH } from '@/pages/game-world/contants/map.ts';
import { Controls } from '@/pages/game-world/controls/Control';
import Phaser from 'phaser';
import { interactableModalManager } from '@/lib/modal.ts';

type BaseSceneOptions = {
	name: string;
	map?: { json: string };
	tileset?: {
		keyName: string;
		sourceKey: string;
		padding?: [number, number];
	}[];
	player?: {
		spawn: Coordinates;
	};
	shadow?: {
		spawn: Coordinates;
	};
	robot?: {
		spawn: Coordinates;
	};
	robotShadow?: {
		spawn: Coordinates;
	};
};

export abstract class BaseScene extends Phaser.Scene {
	options: BaseSceneOptions;

	layers: Record<string, Phaser.Tilemaps.TilemapLayer> = {};
	currentPlayer: Player | undefined;
	currentShadow: Shadow | undefined;
	map: Phaser.Tilemaps.Tilemap = {} as Phaser.Tilemaps.Tilemap;
	zoom = 4;
	colliders?: Phaser.GameObjects.Group;
	interactables?: Phaser.GameObjects.Group;
	controls?: Controls;

	protected constructor(options: BaseSceneOptions) {
		super(options.name);
		this.options = options;
	}

	preload() {
		if (this.options.map) {
			this.load.tilemapTiledJSON(this.options.name, this.options.map.json);
		}
	}

	create() {
		this.controls = new Controls(this.input);
		this._initialiseMap();
		this._createPlayer();
		this._initialiseCamera();
	}

	update() {
		this._updatePlayer();
	}

	_initialiseMap() {
		this.map = this.make.tilemap({ key: this.options.name });
		const tilesets =
			this.options.tileset?.map(tileset => {
				return this.map.addTilesetImage(
					tileset.keyName,
					tileset.sourceKey,
				) as Phaser.Tilemaps.Tileset;
			}) || [];

		this.colliders = this.add.group();

		if (this.map.getObjectLayer('Collision')) {
			const collisionPolygons = this.map.createFromObjects('Collision', {
				scene: this,
			});
			collisionPolygons.forEach((polygon: any) => {
				this.colliders?.add(polygon);
				this.physics.world.enable(polygon);
				polygon.body.immovable = true;
			});
		}

		this.interactables = this.add.group();

		if (this.map.getObjectLayer('Interactable')) {
			const interactablePolygons = this.map.createFromObjects(
				'Interactable',
				{},
			);
			interactablePolygons.forEach(polygon => {
				this.interactables?.add(polygon);
				polygon
					.setInteractive({ cursor: 'pointer' })
					.on('pointerdown', (p: Phaser.Input.Pointer) => {
						if (p.downElement.nodeName === 'CANVAS') {
							const id = polygon.data.list.id;
							interactableModalManager.getState().open(id);
						}
					});
			});
		}

		this.physics.world.drawDebug = false;

		this.map.layers.forEach((layer, index) => {
			const tilemapLayer = this.map.createLayer(layer.name, tilesets, 0, 0);

			let maxDepth = (layer?.properties as any)?.depth || index; // 假设较小值的 depth 在底部
			tilemapLayer?.forEachTile(tile => {
				// 每个 tile 的 depth 属性可以从 Tiled 中设置的自定义属性获取
				if (tile.properties.depth !== undefined) {
					const tileDepth = tile.properties.depth;
					maxDepth = Math.max(maxDepth, tileDepth);
				}
			});
			// 设置整个 tilemapLayer 的 depth
			tilemapLayer?.setDepth(maxDepth);

			this.layers[layer.name] = tilemapLayer as Phaser.Tilemaps.TilemapLayer;
		});

		this.physics.world.setBounds(
			0,
			0,
			this.map.width * SQUARE_WIDTH,
			this.map.height * SQUARE_WIDTH,
		);
	}

	_initialiseCamera() {
		const camera = this.cameras.main;
		camera.setRoundPixels(true);
		camera.setBounds(0, 0, this.map.width * 16, this.map.height * 16);
		camera.setZoom(this.zoom);
		const offsetX =
			(window.innerWidth - this.map.width * 16) / 2 -
			((this.map.width * 16) / 2) * (this.zoom - 1);
		const offsetY = 0;
		camera.setPosition(offsetX, offsetY);
		camera.fadeIn();
	}

	_createPlayer() {
		this.currentPlayer = new Player({
			scene: this,
			y: (this.options.player?.spawn.y ?? 24) * SQUARE_WIDTH,
			x: (this.options.player?.spawn.x ?? 10) * SQUARE_WIDTH,
		});
		this.currentShadow = new Shadow({
			scene: this,
			y: (this.options.shadow?.spawn.y ?? 24) * SQUARE_WIDTH,
			x: (this.options.shadow?.spawn.x ?? 10) * SQUARE_WIDTH,
		});

		(this.currentPlayer.body as Phaser.Physics.Arcade.Body)
			.setOffset(-9, 2)
			.setSize(18, 12)
			.setCollideWorldBounds(true);
		(this.currentShadow.body as Phaser.Physics.Arcade.Body)
			.setOffset(-9, 2)
			.setSize(18, 12)
			.setCollideWorldBounds(true);

		this.cameras.main.startFollow(this.currentPlayer);

		// Callback to fire on collisions
		this.physics.add.collider(
			this.currentPlayer,
			this.colliders as Phaser.GameObjects.Group,
		);
		this.physics.add.collider(
			this.currentShadow,
			this.colliders as Phaser.GameObjects.Group,
		);
	}

	_updatePlayer() {
		if (
			!this.currentPlayer?.body ||
			!this.currentShadow?.body ||
			!this.controls ||
			!this.currentPlayer.isActivated
		) {
			return;
		}

		const { direction, movementAngle, isJumping, isMoving, isAttacking } =
			this.controls.computed();

		// TODO: refactoring to integrate role-related components into a class
		const currentPlayerBody = this.currentPlayer
			.body as Phaser.Physics.Arcade.Body;
		const currentShadowBody = this.currentShadow
			.body as Phaser.Physics.Arcade.Body;
		if (movementAngle !== undefined) {
			currentPlayerBody.setVelocity(
				60 * Math.cos((movementAngle * Math.PI) / 180),
				60 * Math.sin((movementAngle * Math.PI) / 180),
			);
			currentShadowBody.setVelocity(
				60 * Math.cos((movementAngle * Math.PI) / 180),
				60 * Math.sin((movementAngle * Math.PI) / 180),
			);
		} else {
			currentPlayerBody.setVelocity(0, 0);
			currentShadowBody.setVelocity(0, 0);
		}

		this.currentPlayer.direction = direction;
		this.currentShadow.direction = direction;

		if (isJumping) {
			this.currentPlayer.jump(isMoving);
			this.currentShadow.jump();
		}

		if (isAttacking) {
			this.currentPlayer.attack();
			this.currentShadow.attack();
		}

		if (isMoving) {
			this.currentPlayer.walk();
			this.currentShadow.walk();
		} else {
			this.currentPlayer.idle();
			this.currentShadow.idle();
		}

		this.currentPlayer.setDepth(Math.floor(this.currentPlayer.y));
		this.currentShadow?.setDepth(
			Math.min(1, Math.floor(this.currentPlayer.y) - 1),
		);
	}
}
