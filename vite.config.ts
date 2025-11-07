import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //change port for production
  preview: {
    port: 4000,
  },
  // for dev
  server: {
    port: 4000,
  },
});
