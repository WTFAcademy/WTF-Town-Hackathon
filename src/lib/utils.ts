import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const delay = (time: number) => {
	return new Promise<void>(function (resolve) {
		console.log('delay', time, 'ms');
		setTimeout(() => resolve(), time);
	});
};
