import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "ion-icon",
        },
      },
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    }
  },
  resolve: {
      // alias qui permet d'appeler le dossier src avec @ dans les imports
      alias: {
      '@': '/src',
      },
  },
})
