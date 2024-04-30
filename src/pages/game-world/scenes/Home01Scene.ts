import { BaseScene } from './BaseScene';
import { NPC } from '@/pages/game-world/containers/NPC.ts';
import { SQUARE_WIDTH } from '@/pages/game-world/contants/map.ts';
import { Shadow } from '@/pages/game-world/containers/Shadow.ts';
import Phaser from 'phaser';
import {
	EInteractableType,
	ENpcName,
	interactableModalManager,
	npcModalManager,
} from '@/lib/modal.ts';
import { Popup } from '@/pages/game-world/containers/Popup.ts';

export class Home01Scene extends BaseScene {
	sceneId = 'home01';

	currentRobotNPC: NPC | undefined;
	currentRobotNPCShadow: Shadow | undefined;

	interactableElementPopupMap: Record<string, Popup | undefined> = {};

	constructor() {
		super({
			name: 'home01',
			map: { json: '/game/map/home01_map.json' },
			tileset: [
				{
					keyName: '1_Generic_Black_Shadow_16x16',
					sourceKey: 'generic',
				},
				{
					keyName: '2_LivingRoom_Black_Shadow_16x16',
					sourceKey: 'livingRoom',
				},
				{
					keyName: '4_Bedroom_Black_Shadow_16x16',
					sourceKey: 'bedroom',
				},
				{
					keyName: '5_Classroom_and_library_Black_Shadow_16x16',
					sourceKey: 'classroomAndLibrary',
				},
				{
					keyName: '10_Birthday_party_Black_Shadow_16x16',
					sourceKey: 'birthdayParty',
				},
				{
					keyName: '14_Basement_Black_Shadow_16x16',
					sourceKey: 'basement',
				},
				{
					keyName: '20_Japanese_interiors_Black_Shadow_16x16',
					sourceKey: 'japaneseInteriors',
				},
				{
					keyName: 'Room_Builder_16x16',
					sourceKey: 'roomBuilder',
				},
			],
			player: {
				spawn: { x: 10, y: 17.5 },
			},
			shadow: {
				spawn: { x: 10, y: 17.5 },
			},
			robot: {
				spawn: { x: 11.5, y: 9.3 },
			},
			robotShadow: {
				spawn: { x: 11.5, y: 9.3 },
			},
		});
	}

	preload() {
		super.preload();
	}

	async create() {
		super.create();
		this._createNPC();

		this.currentRobotNPC!.addOnClick(() => {
			const distance = Phaser.Math.Distance.BetweenPoints(
				this.currentRobotNPC!,
				this.currentPlayer!,
			);

			if (distance > 40) {
				console.log("I'm too far away");
				return;
			}

			npcModalManager.getState().open(ENpcName.GPT);
			this.currentPlayer?.deactivate();

			npcModalManager.subscribe(state => {
				if (!state.isOpen) {
					setTimeout(() => {
						this.currentPlayer?.activate();
					}, 1000);
				}
			});
		});
	}

	async update() {
		super.update();
		this._updateNPC();
		this._responseToNPC();
	}

	_createNPC() {
		this.currentRobotNPC = new NPC({
			scene: this,
			y: (this.options.robot?.spawn.y ?? 24) * SQUARE_WIDTH,
			x: (this.options.robot?.spawn.x ?? 10) * SQUARE_WIDTH,
		});
		this.currentRobotNPCShadow = new Shadow({
			scene: this,
			y: (this.options.robotShadow?.spawn.y ?? 24) * SQUARE_WIDTH,
			x: (this.options.robotShadow?.spawn.x ?? 10) * SQUARE_WIDTH,
		});

		(this.currentRobotNPC.body as Phaser.Physics.Arcade.Body)
			.setOffset(-9, -10)
			.setSize(18, 20)
			.setImmovable(true)
			.setCollideWorldBounds(true);
		(this.currentRobotNPCShadow.body as Phaser.Physics.Arcade.Body)
			.setOffset(-9, 2)
			.setSize(18, 12)
			.setImmovable(true)
			.setCollideWorldBounds(true);

		this.physics.world.enable(this.currentRobotNPC);
		this.colliders?.add(this.currentRobotNPC);
	}

	_updateNPC() {
		if (!this.currentRobotNPC?.body || !this.currentRobotNPCShadow?.body) {
			return;
		}

		this.currentRobotNPC.idle();
		this.currentRobotNPCShadow.idle();

		this.currentRobotNPC.setDepth(Math.floor(this.currentRobotNPC.y));
		this.currentRobotNPCShadow?.setDepth(
			Math.min(1, Math.floor(this.currentRobotNPC.y) - 1),
		);
	}

	_responseToNPC() {
		const modalIsOpen =
			interactableModalManager.getState().isOpen ||
			npcModalManager.getState().isOpen;
		if (modalIsOpen) {
			return;
		}
		const robotDistance = Phaser.Math.Distance.BetweenPoints(
			this.currentRobotNPC!,
			this.currentPlayer!,
		);

		if (robotDistance < 20) {
			this.currentRobotNPC?.speak('Press X to interact with me!');

			if (this.controls?.onPressChat()) {
				npcModalManager.getState().open(ENpcName.GPT);
				this.currentPlayer?.deactivate();
				this.currentRobotNPC?.shutUp();

				const cancel = npcModalManager.subscribe(state => {
					if (!state.isOpen) {
						setTimeout(() => {
							this.currentPlayer?.activate();
							cancel();
						}, 300);
					}
				});
			}
		} else {
			this.currentRobotNPC?.shutUp();
		}

		const nftGift =
			this.interactables?.getChildren()?.[0] as Phaser.GameObjects.Sprite;

		if (nftGift) {
			const nftGiftDistance = Phaser.Math.Distance.BetweenPoints(
				this.currentPlayer!,
				nftGift as Phaser.GameObjects.Sprite,
			);

			if (nftGiftDistance < 20) {
				const currentNftGiftPopup =
					this.interactableElementPopupMap[nftGift?.data.list.id];
				if (!currentNftGiftPopup?.visible) {
					const popup = new Popup(this, 'Press X to interact with me!', 'left');
					popup.setPosition(
						nftGift.x - nftGift.width / 2 - 10,
						nftGift.y - nftGift.height / 2 - 5,
					);
					popup.setDepth(1000);
					this.add.existing(popup);
					this.interactableElementPopupMap[nftGift?.data.list.id] = popup;
				}

				if (this.controls?.onPressChat()) {
					interactableModalManager.getState().open(EInteractableType.NFT_GIFT);
					this.currentPlayer?.deactivate();
					this.currentRobotNPC?.shutUp();

					const cancel = interactableModalManager.subscribe(state => {
						if (!state.isOpen) {
							setTimeout(() => {
								this.currentPlayer?.activate();
								cancel();
							}, 300);
						}
					});
				}
			} else {
				const currentNftGiftPopup =
					this.interactableElementPopupMap[nftGift?.data.list.id];
				if (currentNftGiftPopup?.visible) {
					currentNftGiftPopup.destroy();
					this.interactableElementPopupMap[nftGift?.data.list.id] = undefined;
				}
			}
		}

		const gameNpc =
			this.interactables?.getChildren()?.[1] as Phaser.GameObjects.Sprite;

		if (gameNpc) {
			const gameNpcDistance = Phaser.Math.Distance.BetweenPoints(
				this.currentPlayer!,
				gameNpc as Phaser.GameObjects.Sprite,
			);

			if (gameNpcDistance < 40) {
				const currentGameNpcPopup =
					this.interactableElementPopupMap[gameNpc?.data.list.id];
				if (!currentGameNpcPopup?.visible) {
					const popup = new Popup(
						this,
						'Press X to interact with me!(Test Only)',
						'left',
					);
					popup.setPosition(
						gameNpc.x - gameNpc.width / 2 - 10,
						gameNpc.y - gameNpc.height / 2 - 5,
					);
					popup.setDepth(1000);
					this.add.existing(popup);
					this.interactableElementPopupMap[gameNpc?.data.list.id] = popup;
				}

				if (this.controls?.onPressChat()) {
					interactableModalManager.getState().open(EInteractableType.IFRAME);
					this.currentPlayer?.deactivate();
					this.currentRobotNPC?.shutUp();

					const cancel = interactableModalManager.subscribe(state => {
						if (!state.isOpen) {
							setTimeout(() => {
								this.currentPlayer?.activate();
								cancel();
							}, 300);
						}
					});
				}
			} else {
				const currentGameNpcPopup =
					this.interactableElementPopupMap[gameNpc?.data.list.id];
				if (currentGameNpcPopup?.visible) {
					currentGameNpcPopup.destroy();
					this.interactableElementPopupMap[gameNpc?.data.list.id] = undefined;
				}
			}
		}
	}
}
