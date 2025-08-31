import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import  tailwindcss  from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()

  ],
  // Use an absolute path for the base URL to prevent issues with routing.
  // This ensures assets are always loaded from the root of the domain.
  base: '/',
});
