import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://xushujia.github.io/newtab/",
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "/src"),
    },
  },
});
