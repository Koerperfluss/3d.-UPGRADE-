// vite.config.ts
import { defineConfig } from "file:///Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN%20PROJEKTE/Koerperfluss-3D-Upgrade/node_modules/vite/dist/node/index.js";
import react from "file:///Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN%20PROJEKTE/Koerperfluss-3D-Upgrade/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN%20PROJEKTE/Koerperfluss-3D-Upgrade/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    // Support Top-Level Await and modern features of WebKit 22625
    minify: "esbuild",
    cssMinify: true,
    modulePreload: {
      polyfill: false
      // Modern WebKit handles module preload natively
    },
    // SPEED: Vendor-Splitting — stabile Cache-Chunks statt einem 2,6-Monolithen
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-firebase": ["firebase"]
        }
      }
    }
  },
  server: {
    port: 3e3,
    host: "0.0.0.0",
    strictPort: true,
    watch: {
      ignored: [
        "**/Ko\u0308rperfluss Edu Local 3d MErch/**",
        "**/aktuell-3d-upgrade*/**",
        "**/venv*/**",
        "**/node_modules_backup*/**",
        "**/.git/**",
        "**/(0)*/**"
      ]
    }
  },
  define: {
    "process.env.GEMINI_API_KEY": JSON.stringify(process.env.GEMINI_API_KEY || "")
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2FzY2hhbGFnbGVyL0Rlc2t0b3AvQ293b3Jrc3BhY2VfSWNoL0ZJUk1FTiBQUk9KRUtURS9Lb2VycGVyZmx1c3MtM0QtVXBncmFkZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3Nhc2NoYWxhZ2xlci9EZXNrdG9wL0Nvd29ya3NwYWNlX0ljaC9GSVJNRU4gUFJPSkVLVEUvS29lcnBlcmZsdXNzLTNELVVwZ3JhZGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3Nhc2NoYWxhZ2xlci9EZXNrdG9wL0Nvd29ya3NwYWNlX0ljaC9GSVJNRU4lMjBQUk9KRUtURS9Lb2VycGVyZmx1c3MtM0QtVXBncmFkZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoeyBcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsIC8vIFN1cHBvcnQgVG9wLUxldmVsIEF3YWl0IGFuZCBtb2Rlcm4gZmVhdHVyZXMgb2YgV2ViS2l0IDIyNjI1XG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiBmYWxzZSAvLyBNb2Rlcm4gV2ViS2l0IGhhbmRsZXMgbW9kdWxlIHByZWxvYWQgbmF0aXZlbHlcbiAgICB9LFxuICAgIC8vIFNQRUVEOiBWZW5kb3ItU3BsaXR0aW5nIFx1MjAxNCBzdGFiaWxlIENhY2hlLUNodW5rcyBzdGF0dCBlaW5lbSAyLDYtTW9ub2xpdGhlblxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd2ZW5kb3ItdGhyZWUnOiBbJ3RocmVlJywgJ0ByZWFjdC10aHJlZS9maWJlcicsICdAcmVhY3QtdGhyZWUvZHJlaSddLFxuICAgICAgICAgICd2ZW5kb3ItZmlyZWJhc2UnOiBbJ2ZpcmViYXNlJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBob3N0OiAnMC4wLjAuMCcsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICB3YXRjaDoge1xuICAgICAgaWdub3JlZDogW1xuICAgICAgICAnKiovS29cdTAzMDhycGVyZmx1c3MgRWR1IExvY2FsIDNkIE1FcmNoLyoqJyxcbiAgICAgICAgJyoqL2FrdHVlbGwtM2QtdXBncmFkZSovKionLFxuICAgICAgICAnKiovdmVudiovKionLFxuICAgICAgICAnKiovbm9kZV9tb2R1bGVzX2JhY2t1cCovKionLFxuICAgICAgICAnKiovLmdpdC8qKicsXG4gICAgICAgICcqKi8oMCkqLyoqJ1xuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52LkdFTUlOSV9BUElfS0VZJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuR0VNSU5JX0FQSV9LRVkgfHwgXCJcIilcbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZhLFNBQVMsb0JBQW9CO0FBQzFjLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztBQUFBLEVBQ2hDLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBO0FBQUEsSUFDWjtBQUFBO0FBQUEsSUFFQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDekQsZ0JBQWdCLENBQUMsU0FBUyxzQkFBc0IsbUJBQW1CO0FBQUEsVUFDbkUsbUJBQW1CLENBQUMsVUFBVTtBQUFBLFFBQ2hDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTiw4QkFBOEIsS0FBSyxVQUFVLFFBQVEsSUFBSSxrQkFBa0IsRUFBRTtBQUFBLEVBQy9FO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
