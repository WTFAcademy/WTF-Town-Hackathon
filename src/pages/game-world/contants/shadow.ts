import { EDirection } from '@/pages/game-world/contants/control';

export enum EPlayerAction {
	IDLE = 'idle',
	WALKING = 'walking',
	ATTACK = 'attack',
	DEAD = 'dead',
	JUMP = 'jump',
}

export enum EShadowKey {
	JUMP_SHADOW = 'shadow-jump',
	DEFAULT_SHADOW = 'shadow-default',
	ATTACK_SHADOW_LEFT = 'shadow-attack-left',
	ATTACK_SHADOW_RIGHT = 'shadow-attack-right',
}

export const getShadowKey = (
	action: EPlayerAction,
	direction?: string,
): string => {
	const map: Record<string, string | Record<string, string>> = {
		[EPlayerAction.IDLE]: EShadowKey.DEFAULT_SHADOW,
		[EPlayerAction.WALKING]: EShadowKey.DEFAULT_SHADOW,
		[EPlayerAction.JUMP]: EShadowKey.JUMP_SHADOW,
		[EPlayerAction.ATTACK]: {
			left: EShadowKey.ATTACK_SHADOW_LEFT,
			right: EShadowKey.ATTACK_SHADOW_RIGHT,
		},
	};

	if (action === EPlayerAction.IDLE) {
		return map[action] as string;
	}

	if (action === EPlayerAction.WALKING) {
		return map[action] as string;
	}

	if (action === EPlayerAction.JUMP) {
		return map[action] as string;
	}

	if (action === EPlayerAction.ATTACK) {
		const actionMap = map[action] as Record<string, string>;
		return actionMap[direction === EDirection.RIGHT ? 'right' : 'left'];
	}

	return map[action] as string;
};

export const SHADOW_SPRITE_SHEETS = [
	{
		key: EShadowKey.DEFAULT_SHADOW,
		url: '/game/player/shadow/walk/sprite_walk_foward_back.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 0,
	},
	{
		key: EShadowKey.JUMP_SHADOW,
		url: '/game/player/shadow/jump/jump_shadow.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 12,
		repeat: 0,
	},
	{
		key: EShadowKey.ATTACK_SHADOW_LEFT,
		url: '/game/player/shadow/attack2/attack2_shadow_left.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 10,
		repeat: 0,
	},
	{
		key: EShadowKey.ATTACK_SHADOW_RIGHT,
		url: '/game/player/shadow/attack2/attack2_shadow_right.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 10,
		repeat: 0,
	},
];

export const SHADOW_KEYS = SHADOW_SPRITE_SHEETS.map(({ key }) => key);
