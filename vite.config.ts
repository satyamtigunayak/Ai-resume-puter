import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
 
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-dom/client'],
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'],   // ✅ prevent Vite from pre-bundling the ES module
  },
});
 