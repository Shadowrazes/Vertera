import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost', 
    hmr: {host: 'localhost'}, 
},

  plugins: [react()],

  /*build: {
    rollupOptions: {
      external: [],
    },
  },*/
  });
