import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use an absolute path for the base URL to prevent issues with routing.
  // This ensures assets are always loaded from the root of the domain.
  base: '/',
});
