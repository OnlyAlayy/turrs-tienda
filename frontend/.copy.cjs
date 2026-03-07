const fs = require('fs');
const path = require('path');
const srcDir = './src/assets/imagenes3d';
const destDir = './public/frames';
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const files = fs.readdirSync(srcDir)
    .filter(f => /^ezgif-frame-\d{3}\.jpg$/.test(f))
    .sort();

files.forEach((file, index) => {
    const num = String(index + 1).padStart(3, '0');
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, `frame_${num}.jpg`));
});
console.log('Copied ' + files.length + ' files');
