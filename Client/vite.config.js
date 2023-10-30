// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [react()],
// // })

// export default defineConfig({
//   plugins: [react({
//     // Add this line
//     include: "**/*.jsx",
//   })],
//   server: {
//     watch: {
//       usePolling: true
//     }
//   },
//   build: {
//     chunkSizeWarningLimit: 2000, // Set to 1 MB
//   },
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // You can change the port as needed
  },
  build: {
    outDir: 'dist', // Output directory for production build
  },
});
