const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    const inputDir = './public/images/original';
    const outputDir = './public/images/optimized';
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const images = fs.readdirSync(inputDir);
    
    for (const image of images) {
        const inputPath = path.join(inputDir, image);
        const name = path.parse(image).name;
        
        // WebP версия
        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(path.join(outputDir, `${name}.webp`));
            
        // JPEG версия (fallback)
        await sharp(inputPath)
            .jpeg({ quality: 85 })
            .resize(1200, null, { withoutEnlargement: true })
            .toFile(path.join(outputDir, `${name}.jpg`));
            
        console.log(`Optimized: ${image}`);
    }
}

optimizeImages();