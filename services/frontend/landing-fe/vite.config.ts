import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

/**
 * Vite plugin that listens for `astranova:terminal-log` events sent by the
 * browser via `import.meta.hot.send(...)` and prints them to the Node.js
 * terminal. This makes shared-clients connection warnings visible server-side.
 */
function terminalLoggerPlugin(): Plugin {
  return {
    name: "astranova-terminal-logger",
    configureServer(server) {
      server.hot.on(
        "astranova:terminal-log",
        (data: { message: string }, client) => {
          process.stdout.write(
            `\n\x1b[33m${data.message}\x1b[0m\n\n`,
          );
          client.send("astranova:terminal-log:ack", {});
        },
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({

  plugins: [react(), tailwindcss(), terminalLoggerPlugin()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three', '@react-three/fiber'],
          'vendor-motion': ['framer-motion'],
          'vendor-utils': ['lenis'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
  },

})
