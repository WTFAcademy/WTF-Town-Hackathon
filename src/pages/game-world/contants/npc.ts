export enum ERobotNPCKey {
	IDLE_LEFT = 'robot-npc-idle-left',
	IDLE_RIGHT = 'robot-npc-idle-right',
}

export const getRobotNPCKey = (direction?: string): string => {
	return direction === 'right' ? 'robot-npc-idle-right' : 'robot-npc-idle-left';
};

export const NPC_SPRITE_SHEETS = [
	{
		key: ERobotNPCKey.IDLE_LEFT,
		url: '/game/npc/robot/action/idle/idle_left/sprite1.png',
		frameConfig: { frameWidth: 30, frameHeight: 30 },
		startFrame: 0,
		endFrame: 7,
		frameRate: 5,
		repeat: -1,
	},
];

export const NPC_KEYS = NPC_SPRITE_SHEETS.map(({ key }) => key);
