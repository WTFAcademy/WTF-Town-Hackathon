import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	base: './',
	build: {
		chunkSizeWarningLimit: 1000,
		assetsDir: 'assets',
		rollupOptions: {
			output: {
				manualChunks: {
					phaser: ['phaser'],
				},
			},
		},
	},
});
