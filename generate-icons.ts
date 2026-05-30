import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

const logoPath = path.resolve(__dirname, '../frontend-app/public/icons/LOGO VOLTARIS.webp');
const publicDir = path.resolve(__dirname, '../frontend-app/public');
const iconsDir = path.resolve(publicDir, 'icons');

const iconTargets = [
  { name: 'apple-icon-120x120.png', size: 120 },
  { name: 'apple-icon-152x152.png', size: 152 },
  { name: 'apple-icon-167x167.png', size: 167 },
  { name: 'apple-icon-180x180.png', size: 180 },
  { name: 'favicon-128x128.png', size: 128 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-256x256.png', size: 256 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'ms-icon-144x144.png', size: 144 },
];

async function run() {
  console.log('Generating icons from master logo:', logoPath);
  
  if (!fs.existsSync(logoPath)) {
    console.error('Master logo not found at', logoPath);
    return;
  }

  for (const target of iconTargets) {
    const targetPath = path.join(iconsDir, target.name);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    await sharp(logoPath)
      .resize(target.size, target.size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(targetPath);
    console.log(`Generated: ${target.name} (${target.size}x${target.size})`);
  }

  const faviconPath = path.join(publicDir, 'favicon.ico');
  if (fs.existsSync(faviconPath)) {
    fs.unlinkSync(faviconPath);
  }
  await sharp(logoPath)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(faviconPath);
  console.log('Generated favicon.ico (32x32)');
  
  console.log('Icon generation completed successfully!');
}

run().catch(console.error);
