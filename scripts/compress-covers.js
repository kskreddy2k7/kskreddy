import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const projectsDir = path.resolve(process.cwd(), 'public/projects');

async function compress() {
  try {
    const dirs = fs.readdirSync(projectsDir);

    for (const dir of dirs) {
      const dirPath = path.join(projectsDir, dir);
      if (fs.statSync(dirPath).isDirectory()) {
        const pngPath = path.join(dirPath, 'cover.png');
        const webpPath = path.join(dirPath, 'cover.webp');
        
        if (fs.existsSync(pngPath)) {
          console.log(`Compressing: ${dir}/cover.png -> cover.webp`);
          await sharp(pngPath)
            .resize(800) // Resize to 800px max width for excellent crispness and tiny file size
            .webp({ quality: 80 }) // Optimize WebP compression
            .toFile(webpPath);
          console.log(`Successfully optimized: ${dir}/cover.webp`);
        }
      }
    }
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error during image optimization:', error);
  }
}

compress();
