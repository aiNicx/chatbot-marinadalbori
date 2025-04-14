import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    themePlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/embed"),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(import.meta.dirname, "client/src/embed.tsx"),
      name: "MarinaChatbot",
      fileName: "marina-chatbot",
      formats: ["umd", "es"],
    },
    rollupOptions: {
      // Assicurati che React e ReactDOM siano esclusi dal bundle
      external: ["react", "react-dom"],
      output: {
        // Global per UMD build
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Ottimizza gli asset
        assetFileNames: "assets/[name].[ext]",
      },
    },
    // Genera sourcemap per il debug in produzione
    sourcemap: true,
  },
});