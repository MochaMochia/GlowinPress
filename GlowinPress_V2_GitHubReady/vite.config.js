import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export const vitePort = 5173;

export default defineConfig(({ mode }) => {
  // Detect if we're in a preview environment or if WebSocket should be disabled
  const isPreview = process.env.NODE_ENV === 'production' || process.env.PREVIEW_MODE === 'true';
  const disableWebSocket = process.env.DISABLE_WEBSOCKET === 'true' || isPreview;
  
  console.log('Vite config:', { 
    mode, 
    isPreview, 
    disableWebSocket, 
    NODE_ENV: process.env.NODE_ENV 
  });
  
  return {
    plugins: [
      react(),
      // Custom plugin to handle WebSocket issues
      {
        name: 'websocket-fallback',
        apply: 'serve',
        configureServer(server) {
          // Override HMR WebSocket handling
          const originalHotUpdate = server.hot?.send;
          if (originalHotUpdate && disableWebSocket) {
            server.hot.send = () => {
              // Silently ignore HMR updates when WebSocket is disabled
            };
          }

          server.middlewares.use((req, res, next) => {
            // Add headers to indicate WebSocket status
            res.setHeader('X-WebSocket-Status', disableWebSocket ? 'disabled' : 'enabled');
            
            // Handle source map requests
            if (req.url && req.url.endsWith('.map')) {
              const cleanUrl = req.url.split('?')[0];
              req.url = cleanUrl;
            }

            // Add CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              return res.end();
            }

            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './client/src'),
      },
    },
    root: path.join(process.cwd(), 'client'),
    build: {
      outDir: path.join(process.cwd(), 'dist/public'),
      emptyOutDir: true,
      sourcemap: !isPreview, // Disable sourcemaps in preview for better performance
    },
    clearScreen: false,
    server: {
      // Completely disable HMR in problematic environments
      hmr: disableWebSocket ? false : {
        overlay: false,
        port: vitePort,
        host: '0.0.0.0',
        // Try to use the current origin for WebSocket connections
        clientPort: undefined, // Let Vite auto-detect
        // Disable WebSocket if we detect issues
        protocol: 'ws',
        timeout: 5000,
      },
      host: '0.0.0.0',
      port: vitePort,
      strictPort: false, // Always allow port fallback
      allowedHosts: true,
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          secure: false,
          ws: false, // Disable WebSocket proxying to prevent conflicts
        },
      },
      // Add error handling for server startup
      middlewareMode: false,
    },
    // Disable source maps in preview for better performance
    css: {
      devSourcemap: !isPreview,
    },
    esbuild: {
      sourcemap: !isPreview,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
      // Force re-optimization in preview environments
      force: isPreview,
    },
    // Define globals
    define: {
      __IS_PREVIEW__: JSON.stringify(isPreview),
      __WEBSOCKET_DISABLED__: JSON.stringify(disableWebSocket),
    },
    // Enhanced error handling
    worker: {
      format: 'es',
    },
  };
});
