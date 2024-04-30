import { BaseScene } from './BaseScene';

export class HomeScene extends BaseScene {
	sceneId = 'home';

	constructor() {
		super({
			name: 'home',
			map: { json: '/game/map/home_map.json' },
			tileset: [{ keyName: 'WTF Town Village', sourceKey: 'village_tileset' }],
		});
	}

	preload() {
		super.preload();
	}

	async create() {
		super.create();
	}
}
