// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ['@coreui/react'],
//   },
//   build: {
//     outDir: 'dist',
//   },
//   server: {
//     historyApiFallback: true,
//     host: '0.0.0.0',   
//   },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@coreui/react"],
  },
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0",     // enables network access
    // port: 5173,          // optional but recommended
    strictPort: true,    // avoids random port changes
  },
});
