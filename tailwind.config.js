/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'wtf-logo': "url('/wtf-logo.png')",
				'home-action': "url('/home/home-action.png')",
			},
			fontFamily: {
				pixel: ['"Press Start 2P"', 'cursive'],
			},
		},
	},
	plugins: [],
};
