/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
	theme: {
		extend: {
			colors: {
				'void-black': '#020408',
				'glass-panel': '#0f172a',
				'core-reactor': '#FF4500',
				'solar-flare': '#FF6B6B',
				'cyan-data': '#00F2FF',
				'neon-violet': '#BC13FE',
				'hologram-white': '#E2E8F0',
			},
			boxShadow: {
				'glow-red': '0 0 20px rgba(255, 69, 0, 0.5)',
				'glow-red-lg': '0 0 30px rgba(255, 69, 0, 0.7)',
				'glow-cyan': '0 0 20px rgba(0, 242, 255, 0.5)',
				'glow-cyan-lg': '0 0 30px rgba(0, 242, 255, 0.7)',
				'glow-violet': '0 0 20px rgba(188, 19, 254, 0.5)',
				'glow-violet-lg': '0 0 30px rgba(188, 19, 254, 0.7)',
				'glow-flare': '0 0 20px rgba(255, 107, 107, 0.5)',
				'glow-flare-lg': '0 0 30px rgba(255, 107, 107, 0.7)',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'Courier New', 'monospace'],
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
