import * as vite from 'vite'

// https://vitejs.dev/config/
export default vite.defineConfig({
  plugins: [],
  optimizeDeps: {
    include: ['github-buttons'],
    exclude: [],
  },
})
