import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create QA folder structure
const distPath = path.join(__dirname, '../dist');
const qaPath = path.join(distPath, 'qa');

// Create qa directory
if (!fs.existsSync(qaPath)) {
  fs.mkdirSync(qaPath, { recursive: true });
}

// Copy index.html to qa/index.html
const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
fs.writeFileSync(path.join(qaPath, 'index.html'), indexHtml);

// Create qa/assets directory
const qaAssetsPath = path.join(qaPath, 'assets');
if (!fs.existsSync(qaAssetsPath)) {
  fs.mkdirSync(qaAssetsPath, { recursive: true });
}

// Copy assets to qa/assets
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assets = fs.readdirSync(assetsPath);
  assets.forEach(asset => {
    const srcPath = path.join(assetsPath, asset);
    const destPath = path.join(qaAssetsPath, asset);
    fs.copyFileSync(srcPath, destPath);
  });
}

console.log('✅ QA folder created successfully');
console.log('📁 QA folder location:', qaPath);
