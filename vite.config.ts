import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
	plugins: [react(), cssInjectedByJsPlugin()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			input: './src/client.tsx',
			output: {
				entryFileNames: 'assets/[name].js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
	},
});
