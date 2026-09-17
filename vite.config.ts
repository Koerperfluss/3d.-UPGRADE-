import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({ 
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext', // Support Top-Level Await and modern features of WebKit 22625
    minify: 'esbuild',
    cssMinify: true,
    modulePreload: {
      polyfill: false // Modern WebKit handles module preload natively
    },
    // SPEED: Vendor-Splitting — Function-Form, da bare 'firebase' als Entry nicht auflösbar ist
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/three/') || id.includes('@react-three')) return 'vendor-three';
          if (id.includes('firebase')) return 'vendor-firebase';
          if (id.includes('/react') || id.includes('scheduler') || id.includes('react-router')) return 'vendor-react';
          return undefined;
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      ignored: [
        '**/Körperfluss Edu Local 3d MErch/**',
        '**/aktuell-3d-upgrade*/**',
        '**/venv*/**',
        '**/node_modules_backup*/**',
        '**/.git/**',
        '**/(0)*/**'
      ]
    }
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || "")
  }
});
