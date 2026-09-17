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
    // SPEED: Vendor-Splitting — stabile Cache-Chunks statt einem 2,6-Monolithen
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-firebase': ['firebase']
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
