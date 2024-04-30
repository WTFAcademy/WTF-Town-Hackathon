import { EDirection } from '@/pages/game-world/contants/control';

export enum EPlayerAction {
	IDLE = 'idle',
	WALKING = 'walking',
	ATTACK = 'attack',
	DEAD = 'dead',
	JUMP = 'jump',
}

export enum EPlayerKey {
	IDLE_LEFT = 'player-idle-left',
	IDLE_RIGHT = 'player-idle-right',
	WALK_LEFT = 'player-walk-left',
	WALK_RIGHT = 'player-walk-right',
	WALK_BACK = 'player-walk-back',
	WALK_FOWARD = 'player-walk-foward',
	JUMP_LEFT = 'player-jump-left',
	JUMP_RIGHT = 'player-jump-right',
	ATTACK_LEFT = 'player-attack-left',
	ATTACK_RIGHT = 'player-attack-right',
}

export const getPlayerKey = (action: EPlayerAction, direction: string) => {
	const map: Record<string, Record<string, string>> = {
		[EPlayerAction.IDLE]: {
			left: EPlayerKey.IDLE_LEFT,
			right: EPlayerKey.IDLE_RIGHT,
			back: EPlayerKey.IDLE_LEFT,
			foward: EPlayerKey.IDLE_LEFT,
		},
		[EPlayerAction.WALKING]: {
			left: EPlayerKey.WALK_LEFT,
			right: EPlayerKey.WALK_RIGHT,
			back: EPlayerKey.WALK_BACK,
			foward: EPlayerKey.WALK_FOWARD,
		},
		[EPlayerAction.JUMP]: {
			left: EPlayerKey.JUMP_LEFT,
			right: EPlayerKey.JUMP_RIGHT,
		},
		[EPlayerAction.ATTACK]: {
			left: EPlayerKey.ATTACK_LEFT,
			right: EPlayerKey.ATTACK_RIGHT,
		},
	};

	if (action === EPlayerAction.JUMP || action === EPlayerAction.ATTACK) {
		return map[action][
			direction === EDirection.RIGHT ? EDirection.RIGHT : EDirection.LEFT
		];
	}

	return map[action][direction];
};

export const PLAYER_SPRITE_SHEETS = [
	{
		key: EPlayerKey.IDLE_LEFT,
		url: '/game/player/player00/action/idle/idle_left/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
	},
	{
		key: EPlayerKey.IDLE_RIGHT,
		url: '/game/player/player00/action/idle/idle_right/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
	},
	{
		key: EPlayerKey.WALK_LEFT,
		url: '/game/player/player00/action/walk/walk_left/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 5,
		frameRate: 10,
	},
	{
		key: EPlayerKey.WALK_RIGHT,
		url: '/game/player/player00/action/walk/walk_right/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 5,
		frameRate: 10,
	},
	{
		key: EPlayerKey.WALK_BACK,
		url: '/game/player/player00/action/walk/walk_back/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 5,
		frameRate: 10,
	},
	{
		key: EPlayerKey.WALK_FOWARD,
		url: '/game/player/player00/action/walk/walk_foward/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 5,
		frameRate: 10,
	},
	{
		key: EPlayerKey.JUMP_LEFT,
		url: '/game/player/player00/action/jump/jump_left/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 41 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 12,
		repeat: 0,
	},
	{
		key: EPlayerKey.JUMP_RIGHT,
		url: '/game/player/player00/action/jump/jump_right/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 41 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 12,
		repeat: 0,
	},
	{
		key: EPlayerKey.ATTACK_LEFT,
		url: '/game/player/player00/action/attack2/attack_left/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 10,
		repeat: 0,
	},
	{
		key: EPlayerKey.ATTACK_RIGHT,
		url: '/game/player/player00/action/attack2/attack_right/sprite.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 10,
		repeat: 0,
	},
];

export const PLAYER_KEYS = PLAYER_SPRITE_SHEETS.map(({ key }) => key);
