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
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || "")
  }
});
