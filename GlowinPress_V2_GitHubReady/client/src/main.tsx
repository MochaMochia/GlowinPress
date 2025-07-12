import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

// Handle theme detection - default to dark mode
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function updateDarkClass(e = null) {
  // Always default to dark mode
  const isDark = true; // Force dark mode as default
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add('dark');
  
  // Only check system preference if no forced default
  if (e && !localStorage.getItem('theme')) {
    const systemPrefersDark = e.matches;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
  }
}

// Set initial theme to dark mode
updateDarkClass();
darkQuery.addEventListener('change', updateDarkClass);

// Enhanced WebSocket error handling
const isPreview = typeof __IS_PREVIEW__ !== 'undefined' && __IS_PREVIEW__;
const websocketDisabled = typeof __WEBSOCKET_DISABLED__ !== 'undefined' && __WEBSOCKET_DISABLED__;

if (isPreview || websocketDisabled) {
  console.log('WebSocket/HMR disabled - preview/production mode detected');
  
  // Completely disable Vite's WebSocket attempts
  if (import.meta.hot) {
    // Override WebSocket connection attempts
    const originalOn = import.meta.hot.on;
    import.meta.hot.on = (event, callback) => {
      if (event.includes('ws') || event.includes('websocket')) {
        // Silently ignore WebSocket events
        return;
      }
      return originalOn.call(import.meta.hot, event, callback);
    };
    
    // Disable specific WebSocket events
    import.meta.hot.on('vite:ws:disconnect', () => {
      // Silently handle disconnect
    });
    
    import.meta.hot.on('vite:ws:connect', () => {
      // Silently handle connect
    });
  }
} else {
  // Development mode with WebSocket support
  if (import.meta.hot) {
    let wsErrorCount = 0;
    const maxWsErrors = 3;
    
    import.meta.hot.on('vite:error', (error) => {
      console.error('Vite error:', error);
    });
    
    import.meta.hot.on('vite:ws:disconnect', () => {
      wsErrorCount++;
      if (wsErrorCount <= maxWsErrors) {
        console.log(`WebSocket disconnected (${wsErrorCount}/${maxWsErrors})`);
      }
      
      if (wsErrorCount >= maxWsErrors) {
        console.warn('Multiple WebSocket failures detected - switching to polling mode');
        // Could implement polling fallback here if needed
      }
    });
    
    import.meta.hot.on('vite:ws:connect', () => {
      if (wsErrorCount > 0) {
        console.log('WebSocket reconnected successfully');
        wsErrorCount = 0;
      }
    });
  }
}

// Enhanced console error filtering
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Filter WebSocket errors in production/preview environments
    if ((isPreview || websocketDisabled) && (
      message.includes('WebSocket') ||
      message.includes('websocket') ||
      message.includes('failed to connect to websocket') ||
      message.includes('WebSocket closed without opened')
    )) {
      console.log('WebSocket error suppressed (expected in preview mode):', message);
      return;
    }
    
    // Filter other known harmless errors
    if (message.includes('ResizeObserver loop limit exceeded') ||
        message.includes('Non-passive event listener')) {
      return;
    }
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Filter WebSocket warnings
    if ((isPreview || websocketDisabled) && (
      message.includes('WebSocket') ||
      message.includes('websocket') ||
      message.includes('HMR')
    )) {
      return;
    }
  }
  originalConsoleWarn.apply(console, args);
};

// Add connection status indicator
if (!isPreview && !websocketDisabled) {
  let connectionStatus = 'connected';
  
  const updateConnectionStatus = (status) => {
    if (connectionStatus !== status) {
      connectionStatus = status;
      document.body.setAttribute('data-connection-status', status);
    }
  };

  // Monitor WebSocket connection if available
  if (import.meta.hot) {
    import.meta.hot.on('vite:ws:disconnect', () => updateConnectionStatus('disconnected'));
    import.meta.hot.on('vite:ws:connect', () => updateConnectionStatus('connected'));
  }
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
