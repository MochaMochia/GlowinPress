import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function initFFmpeg() {
  if (ffmpeg) return ffmpeg;
  
  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
}

export async function convertFile(file: File, format: string): Promise<void> {
  // For images, use canvas-based conversion
  if (file.type.startsWith('image/')) {
    return convertImage(file, format);
  }
  
  // For videos, show not implemented message
  if (file.type.startsWith('video/')) {
    throw new Error('Video conversion requires backend processing with FFmpeg. This feature is not yet implemented in the browser.');
  }
  
  throw new Error(`Unsupported file type: ${file.type}`);
}

async function convertImage(file: File, format: string): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const img = new Image();
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  let mimeType: string;
  let fileExtension: string;
  
  switch (format) {
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      fileExtension = 'jpg';
      break;
    case 'png':
      mimeType = 'image/png';
      fileExtension = 'png';
      break;
    case 'webp':
      mimeType = 'image/webp';
      fileExtension = 'webp';
      break;
    default:
      throw new Error(`Unsupported image format: ${format}`);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    const quality = mimeType === 'image/jpeg' ? 0.9 : undefined;
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob) throw new Error('Failed to convert image');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  a.href = url;
  a.download = `converted_${baseName}.${fileExtension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
  URL.revokeObjectURL(img.src);
}

function getMimeType(format: string): string {
  switch (format) {
    case 'mp4':
      return 'video/mp4';
    case 'mp3':
      return 'audio/mp3';
    case 'webm':
      return 'video/webm';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}
