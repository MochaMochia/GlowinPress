import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';
import ytdl from '@distube/ytdl-core';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// YouTube download endpoint
app.post('/api/youtube/download', async (req, res) => {
  try {
    const { url, format } = req.body;
    
    console.log('YouTube download request:', { url, format });
    
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      res.status(400).json({ error: 'Invalid YouTube URL' });
      return;
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '').trim();
    
    console.log('Video info retrieved:', { title, lengthSeconds: info.videoDetails.lengthSeconds });

    // Set appropriate headers
    let mimeType = 'video/mp4';
    let filename = `${title}.mp4`;
    
    if (format === 'mp3') {
      mimeType = 'audio/mpeg';
      filename = `${title}.mp3`;
    } else if (format === 'webm') {
      mimeType = 'video/webm';
      filename = `${title}.webm`;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeType);

    // Configure download options based on format
    let downloadOptions: any = {};
    
    if (format === 'mp3') {
      // Audio only
      downloadOptions = {
        filter: 'audioonly',
        quality: 'highestaudio',
      };
    } else if (format === 'webm') {
      // WebM video
      downloadOptions = {
        filter: (format: any) => format.container === 'webm' && format.hasVideo,
        quality: 'highest',
      };
    } else {
      // MP4 video (default)
      downloadOptions = {
        filter: (format: any) => format.container === 'mp4' && format.hasVideo && format.hasAudio,
        quality: 'highest',
      };
    }

    console.log('Starting download with options:', downloadOptions);

    // Stream the video
    const stream = ytdl(url, downloadOptions);
    
    stream.on('error', (error) => {
      console.error('YouTube stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to process video stream' });
      }
    });

    stream.on('end', () => {
      console.log('Download stream ended successfully');
    });

    // Pipe the stream to response
    stream.pipe(res);

  } catch (error) {
    console.error('YouTube download error:', error);
    
    let errorMessage = 'Failed to download video';
    
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        errorMessage = 'Video is unavailable or private';
      } else if (error.message.includes('Restricted')) {
        errorMessage = 'Video is restricted in your region';
      } else if (error.message.includes('copyright')) {
        errorMessage = 'Video cannot be downloaded due to copyright restrictions';
      } else {
        errorMessage = error.message;
      }
    }
    
    if (!res.headersSent) {
      res.status(500).json({ error: errorMessage });
    }
  }
});

// YouTube video info endpoint
app.post('/api/youtube/info', async (req, res) => {
  try {
    const { url } = req.body;
    
    console.log('YouTube info request:', { url });
    
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    if (!ytdl.validateURL(url)) {
      res.status(400).json({ error: 'Invalid YouTube URL' });
      return;
    }

    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    
    const videoInfo = {
      title: videoDetails.title,
      duration: videoDetails.lengthSeconds,
      thumbnail: videoDetails.thumbnails[0]?.url || '',
      formats: [
        { quality: 'Highest', format: 'mp4', fileSize: 'Unknown' },
        { quality: 'Audio Only', format: 'mp3', fileSize: 'Unknown' },
        { quality: 'WebM', format: 'webm', fileSize: 'Unknown' }
      ]
    };
    
    console.log('Video info response:', videoInfo);
    res.json(videoInfo);

  } catch (error) {
    console.error('YouTube info error:', error);
    
    let errorMessage = 'Failed to fetch video information';
    
    if (error instanceof Error) {
      if (error.message.includes('Video unavailable')) {
        errorMessage = 'Video is unavailable or private';
      } else if (error.message.includes('Restricted')) {
        errorMessage = 'Video is restricted in your region';
      }
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  console.log('Serving static files from:', publicPath);
  
  app.use(express.static(publicPath));
  
  // Handle client-side routing
  app.get('/*splat', (req, res) => {
    const filePath = path.join(publicPath, 'index.html');
    console.log('Serving index.html for route:', req.path);
    res.sendFile(filePath);
  });
}

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express error:', error);
  
  if (!res.headersSent) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.path);
  res.status(404).json({ error: 'Route not found' });
});

export async function startServer(port: number = 5173) {
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📁 Data directory: ${process.env.DATA_DIRECTORY || 'not set'}`);
      resolve();
    });

    server.on('error', (error) => {
      console.error('❌ Server failed to start:', error);
      reject(error);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  });
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT) || 5173;
  startServer(port).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
