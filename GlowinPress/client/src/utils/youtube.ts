// YouTube download utility functions

export interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  formats: VideoFormat[];
}

export interface VideoFormat {
  quality: string;
  format: string;
  fileSize?: string;
}

export async function downloadYouTubeVideo(
  url: string, 
  format: string, 
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    console.log('Starting YouTube download:', { url, format });
    
    // Validate URL
    if (!isValidYouTubeUrl(url)) {
      throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
    }

    // Simulate progress for now
    if (onProgress) {
      const progressInterval = setInterval(() => {
        const currentProgress = Math.random() * 10;
        onProgress(Math.min(currentProgress, 95));
      }, 500);

      // Stop progress simulation after some time
      setTimeout(() => {
        clearInterval(progressInterval);
        onProgress(100);
      }, 3000);
    }

    // Make API call to backend
    const response = await fetch('/api/youtube/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        format,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    // Handle the download
    const contentDisposition = response.headers.get('content-disposition');
    const filename = extractFilenameFromHeader(contentDisposition) || `video.${format}`;
    
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(downloadUrl);
    
    console.log('Download completed successfully');
    
  } catch (error) {
    console.error('YouTube download error:', error);
    throw error;
  }
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    const response = await fetch('/api/youtube/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch video information');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
}

export function isValidYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(url);
}

export function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function extractFilenameFromHeader(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;
  
  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
  if (matches != null && matches[1]) {
    return matches[1].replace(/['"]/g, '');
  }
  return null;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
