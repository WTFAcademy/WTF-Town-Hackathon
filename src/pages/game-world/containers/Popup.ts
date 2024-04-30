export class Popup extends Phaser.GameObjects.Container {
	text: Phaser.GameObjects.BitmapText;
	bubble: Phaser.GameObjects.Graphics; // 使用 Graphics 替代 bubble

	constructor(scene: Phaser.Scene, text: string, direction: 'left' | 'right') {
		super(scene, 0, 0);
		this.scene = scene;

		const MAX_WIDTH = 60;
		this.text = scene.add
			.bitmapText(0, 0, 'PressStart2P', text, 3)
			.setMaxWidth(MAX_WIDTH);

		const bounds = this.text.getBounds();

		this.bubble = scene.add.graphics();

		const padding = 4;
		this.bubble.fillStyle(0x000000, 0.5); // 白色填充，0.8 的透明度
		this.bubble.fillRoundedRect(
			0,
			0,
			bounds.width + 2 * padding,
			bounds.height + 2 * padding,
			2,
		);

		this.add(this.bubble);
		this.add(this.text);

		this.bubble.setPosition(-padding, -bounds.height / 2); // 定位气泡框位置

		this.setPosition(
			direction === 'right' ? 2 : -bounds.width,
			-bounds.height - 12,
		);
	}
}
