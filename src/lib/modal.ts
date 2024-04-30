import { create } from 'zustand';

export enum ENpcName {
	GPT = 'GPT',
}

type TNpcModalManager = {
	npc: ENpcName | null;
	isOpen: boolean;
	data: { position: { x: number; y: number } };
	open: (npc: ENpcName, data?: { position: { x: number; y: number } }) => void;
	close: () => void;
};

export const npcModalManager = create<TNpcModalManager>(set => ({
	npc: null,
	isOpen: false,
	data: { position: { x: 0, y: 0 } },
	open: (npc, data) => set({ npc, isOpen: true, data }),
	close: () => set({ isOpen: false }),
}));

export enum EInteractableType {
	GPT = 'GPT',
	NFT_GIFT = 'NFT_GIFT',
	GUIDE = 'GUIDE',
	IFRAME = 'IFRAME',
}

type TInteractableModalManager = {
	type: EInteractableType | null;
	isOpen: boolean;
	data: { position: { x: number; y: number } };
	open: (
		npc: EInteractableType,
		data?: { position: { x: number; y: number } },
	) => void;
	close: () => void;
};

export const interactableModalManager = create<TInteractableModalManager>(
	set => ({
		type: null,
		isOpen: false,
		data: { position: { x: 0, y: 0 } },
		open: (type, data) => set({ type, isOpen: true, data }),
		close: () => set({ isOpen: false }),
	}),
);
