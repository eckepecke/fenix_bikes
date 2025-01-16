import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
    plugins: [react()],
    server: {
      host: '0.0.0.0',  // Allow external access
      port: 5174,
    },
  };