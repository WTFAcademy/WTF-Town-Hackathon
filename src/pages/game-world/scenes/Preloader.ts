import { TILESETS } from '@/pages/game-world/contants/map.ts';

export abstract class Preloader extends Phaser.Scene {
	preload() {
		this.load.on(
			Phaser.Loader.Events.FILE_LOAD_ERROR,
			(file: Phaser.Loader.File) => {
				console.error(
					`File load error ${JSON.stringify({ name: file.key, url: file.url })}`,
				);
			},
		);

		try {
			TILESETS.forEach(tileset => {
				// console.log("tileset: ", tileset)
				this.load.image(tileset.key, tileset.url);
			});

			this.load.spritesheet('silhouette', '/game/player/silhouette.webp', {
				frameWidth: 14,
				frameHeight: 18,
			});

			this.load.bitmapFont(
				'PressStart2P',
				'/game/fonts/PressStart2P.png',
				'/game/fonts/PressStart2P.xml',
			);

			this.load.once('complete', () => {
				this.scene.start(this.registry.get('initialScene'));
			});
		} catch (e) {
			console.log('error: ', e);
		}
	}
}
