import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/',
    plugins: [
        react({
          jsxImportSource: '@emotion/react',
          babel: {
            plugins: ['@emotion/babel-plugin'],
          },
        }),
      ],
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // Set the default port  
        port: 3000, 
    },
})