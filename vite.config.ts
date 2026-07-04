import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import {defineConfig} from 'vite';
import { execSync } from 'child_process';

// Auto-run static SEO generation to guarantee parity between local, preview, and Cloudflare Pages
try {
  console.log('Vite Configuration: Running static SEO generator...');
  execSync('npx tsx scripts/generate-static-seo.ts', { stdio: 'inherit' });
} catch (error) {
  console.error('Vite Configuration Warning: Static SEO generation failed:', error);
}

export default defineConfig(() => {
  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
