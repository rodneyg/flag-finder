import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

// Extend the Config type to include daisyui
interface CustomConfig extends Config {
  daisyui?: {
    themes: string[];
  };
}

const config: CustomConfig = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'],
  },
};

export default config;