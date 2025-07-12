import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: express.Application) {
  // Determine the correct public directory path
  let publicPath: string;
  
  if (process.env.NODE_ENV === 'production') {
    // In production, serve from dist/public
    publicPath = path.join(process.cwd(), 'dist', 'public');
  } else {
    // In development, serve from client/dist (if it exists) or fallback
    publicPath = path.join(process.cwd(), 'public');
  }
  
  console.log('Serving static files from:', publicPath);
  
  // Serve static files from the public directory
  app.use(express.static(publicPath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
    etag: true,
    lastModified: true
  }));

  // For any other routes, serve the index.html file
  app.get('/*splat', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    
    const indexPath = path.join(publicPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
}
