/* eslint-disable @typescript-eslint/no-explicit-any */

export type SpriteStyle = 'retro' | 'snes' | 'gameboy' | 'modern' | 'cartoon';

const stylePrompts: Record<SpriteStyle, string> = {
  retro: 'pixel art platformer character sprite sheet, 32x32 pixels per frame, 4-directional walk cycle, retro NES style, clean transparent background',
  snes: 'pixel art platformer character sprite sheet, 32x32 pixels per frame, 4-directional walk cycle, SNES 16-bit style, clean transparent background',
  gameboy: 'pixel art platformer character sprite sheet, 16x16 pixels per frame, 4-directional walk cycle, Gameboy green monochrome, clean transparent background',
  modern: 'pixel art platformer character sprite sheet, 32x32 pixels per frame, 4-directional walk cycle, modern indie game style like Celeste, clean transparent background',
  cartoon: 'pixel art platformer character sprite sheet, 32x32 pixels per frame, 4-directional walk cycle, colorful cartoon style, clean transparent background',
};

/**
 * Check if Puter.js is loaded and ready
 */
export const isPuterReady = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).puter !== 'undefined';
};

/**
 * Wait for Puter.js to become available
 */
export const waitForPuter = (timeout = 10000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isPuterReady()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isPuterReady()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

/**
 * Convert a drawing to a platformer sprite sheet using Puter.js AI
 */
export const convertToSpriteSheet = async (
  imageFile: File | Blob,
  style: SpriteStyle = 'retro',
  size: number = 32
): Promise<{ spriteUrl: string; previewUrl: string }> => {
  if (!isPuterReady()) {
    throw new Error('Puter.js not loaded. Please refresh the page.');
  }

  const puter = (window as any).puter;
  const imageUrl = URL.createObjectURL(imageFile);

  const prompt = `${stylePrompts[style]}, preserve original drawing character design and pose, exactly 4 frames, perfect sprite sheet layout`;

  try {
    // Generate sprite sheet using img2img
    const result = await puter.ai.img2img({
      prompt,
      image_url: imageUrl,
      strength: 0.65,
      width: size * 4,
      height: size,
      nologo: true,
      testMode: false,
    });

    const spriteUrl = result[0].url;

    // Generate single preview frame for gallery
    const previewResult = await puter.ai.img2img({
      prompt: `${stylePrompts[style]}, single front-facing character, clean transparent background`,
      image_url: imageUrl,
      strength: 0.7,
      width: size * 2,
      height: size * 2,
      nologo: true,
      testMode: false,
    });

    return {
      spriteUrl,
      previewUrl: previewResult[0].url,
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

/**
 * Convert file to base64 string
 */
export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
