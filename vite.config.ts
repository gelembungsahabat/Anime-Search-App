import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          swr: ["swr", "use-debounce"],
        },
      },
    },
    cssMinify: "lightningcss",
  },
  //change port for production
  preview: {
    port: 4000,
  },
  // for dev
  server: {
    port: 4000,
  },
});
