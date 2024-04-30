import { useEffect, useRef } from 'react';
import { AUTO, Game } from 'phaser';
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

import { Preloader } from './scenes/Preloader';
import { HomeScene } from './scenes/HomeScene';
import { Home01Scene } from '@/pages/game-world/scenes/Home01Scene.ts';
import {
	EInteractableType,
	interactableModalManager as useInteractableModal,
	npcModalManager as useNpcModal,
} from '@/lib/modal.ts';
import NpcModals from '@/components/modal/npc';
import InteractableModals from '@/components/modal/interactable';

const scenes = [Preloader, HomeScene, Home01Scene];

const GameWorld = () => {
	const ref = useRef<HTMLDivElement>(null);
	const game = useRef<Game>();
	const { close: closeNpcModals } = useNpcModal();
	const { close: closeInteractableModals } = useInteractableModal();

	useEffect(() => {
		const config: Phaser.Types.Core.GameConfig = {
			type: AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			parent: 'game-content',
			backgroundColor: '#000000',
			fps: {
				target: 60,
				smoothStep: true,
			},
			autoRound: true,
			pixelArt: true,
			plugins: {
				global: [
					{
						key: 'rexNinePatchPlugin',
						plugin: NinePatchPlugin,
						start: true,
					},
					{
						key: 'rexVirtualJoystick',
						plugin: VirtualJoystickPlugin,
						start: true,
					},
				],
			},
			physics: {
				default: 'arcade',
				arcade: {
					debug: true,
					gravity: { y: 0, x: 0 },
				},
			},
			scene: scenes,
			loader: {
				crossOrigin: 'anonymous',
			},
		};
		game.current = new Game(config);
		game.current.registry.set('initialScene', 'home01');

		return () => {
			closeNpcModals();
			closeInteractableModals();
			game.current?.destroy(true);
		};
	}, []);

	useEffect(() => {
		const onPress = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeNpcModals();
				closeInteractableModals();
			}
		};

		window.addEventListener('keydown', onPress);

		return () => {
			window.removeEventListener('keydown', onPress);
		};
	}, []);

	useEffect(() => {
		const isNewUser = !localStorage.getItem('WTF-GAME-GUIDE');
		console.log(isNewUser);
		if (isNewUser) {
			useInteractableModal.getState().open(EInteractableType.GUIDE);
			localStorage.setItem('WTF-GAME-GUIDE', 'true');
		}
	}, []);

	return (
		<div>
			<div id="game-content" ref={ref} />
			<NpcModals />
			<InteractableModals />
		</div>
	);
};

export default GameWorld;
