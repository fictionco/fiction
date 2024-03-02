import { vite } from "@factor/api/lib"

// https://vitejs.dev/config/
export default vite.defineConfig({
  plugins: [],
  optimizeDeps: {
    include: ["github-buttons"],
    exclude: [],
  },
})
