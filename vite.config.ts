import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "@mui/material"],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name) {
            const info = assetInfo.name.split(".");
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name].[hash][extname]`;
            }
          }
          return `assets/[name].[hash][extname]`;
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.jpeg"],
  resolve: {
    alias: {
      "@": "/src",
      "@assets": "/src/assets",
    },
  },
});
