import { startServer } from '../server/index.js';
import { createServer } from 'vite';

let viteServer;

async function startDev() {
  // Detect if we're in a preview environment
  const isPreview = process.env.NODE_ENV === 'production' || process.env.PREVIEW_MODE === 'true';
  const disableWebSocket = process.env.DISABLE_WEBSOCKET === 'true' || isPreview;
  
  console.log('Starting development servers...');
  console.log('Environment:', { 
    isPreview, 
    disableWebSocket,
    NODE_ENV: process.env.NODE_ENV,
    PREVIEW_MODE: process.env.PREVIEW_MODE
  });

  // Start the Express API server first
  console.log('Starting Express API server on port 3001...');
  await startServer(3001);

  // Then start Vite in dev mode
  console.log('Starting Vite dev server...');
  
  // Configuration for different environments
  const viteConfig = {
    configFile: './vite.config.js',
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
      // Disable HMR completely in problematic environments
      hmr: disableWebSocket ? false : {
        overlay: false,
        port: 3000,
        host: '0.0.0.0',
        clientPort: undefined,
      },
    },
    // Add environment variables
    define: {
      __IS_PREVIEW__: JSON.stringify(isPreview),
      __WEBSOCKET_DISABLED__: JSON.stringify(disableWebSocket),
    },
  };

  try {
    viteServer = await createServer(viteConfig);
    await viteServer.listen();
    
    const serverUrl = viteServer.resolvedUrls?.local[0] || 'http://localhost:3000';
    console.log(`✅ Vite dev server running at: ${serverUrl}`);
    
    if (disableWebSocket) {
      console.log('🔧 WebSocket/HMR disabled for stability');
    } else {
      console.log('🔧 WebSocket/HMR enabled');
    }
    
  } catch (error) {
    console.error('❌ Failed to start Vite server:', error);
    
    // First fallback: Disable WebSocket/HMR
    console.log('🔄 Attempting fallback with WebSocket disabled...');
    
    try {
      const fallbackConfig = {
        ...viteConfig,
        server: {
          ...viteConfig.server,
          hmr: false,
        },
        define: {
          ...viteConfig.define,
          __WEBSOCKET_DISABLED__: JSON.stringify(true),
        },
      };
      
      viteServer = await createServer(fallbackConfig);
      await viteServer.listen();
      console.log('✅ Vite server started with WebSocket disabled');
      
    } catch (fallbackError) {
      console.error('❌ First fallback failed:', fallbackError);
      
      // Second fallback: Minimal configuration
      console.log('🔄 Attempting minimal configuration fallback...');
      
      try {
        const minimalConfig = {
          configFile: './vite.config.js',
          server: {
            host: '0.0.0.0',
            port: 3000,
            strictPort: false,
            hmr: false,
            ws: false,
          },
        };
        
        viteServer = await createServer(minimalConfig);
        await viteServer.listen();
        console.log('✅ Vite server started with minimal configuration');
        
      } catch (minimalError) {
        console.error('❌ All fallbacks failed:', minimalError);
        console.log('🚨 Unable to start Vite server. Please check your configuration.');
        process.exit(1);
      }
    }
  }
}

// Enhanced error handling for WebSocket issues
const handleWebSocketError = (error) => {
  if (error.message?.includes('WebSocket') || error.code === 'ECONNREFUSED') {
    console.log('🔧 WebSocket error detected, this is expected in some environments');
    return;
  }
  console.error('Server error:', error);
};

// Handle graceful shutdown
const shutdown = async (signal) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  if (viteServer) {
    try {
      await viteServer.close();
      console.log('✅ Vite server closed successfully');
    } catch (err) {
      console.error('❌ Error closing Vite server:', err);
    }
  }
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle nodemon restarts
if (process.env.npm_lifecycle_event?.includes('watch')) {
  let isRestarting = false;

  process.once('SIGUSR2', async () => {
    if (isRestarting) return;
    isRestarting = true;

    console.log('🔄 Nodemon restart detected, closing Vite server...');
    if (viteServer) {
      try {
        await viteServer.close();
        console.log('✅ Vite server closed successfully');
      } catch (err) {
        console.error('❌ Error closing Vite server:', err);
      }
    }

    process.kill(process.pid, 'SIGUSR2');
  });
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  handleWebSocketError(reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  handleWebSocketError(error);
  if (!error.message?.includes('WebSocket')) {
    process.exit(1);
  }
});

// Start the development environment
startDev().catch((error) => {
  console.error('❌ Failed to start development environment:', error);
  handleWebSocketError(error);
  if (!error.message?.includes('WebSocket')) {
    process.exit(1);
  }
});
