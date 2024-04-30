export type Coordinates = {
	x: number;
	y: number;
};

export type Position = {
	height?: number;
	width?: number;
	children?: React.ReactNode;
} & Coordinates;
