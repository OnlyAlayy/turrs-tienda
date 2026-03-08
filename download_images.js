const fs = require('fs');
const https = require('https');
const path = require('path');

const outputDir = path.join(__dirname, 'frontend', 'public', 'images', 'products');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
    'arg_titular.jpg',
    'arg_alternativa.jpg',
    'arg_1986.jpg',
    'arg_1978.jpg',
    'adidas_buzo.jpg',
    'adidas_campera.jpg',
    'adidas_short.jpg',
    'adidas_remera.jpg',
    'nike_buzo.jpg',
    'nike_campera.jpg',
    'nike_short.jpg',
    'nike_remera.jpg',
    'adidas_predator.jpg',
    'nike_mercurial.jpg',
    'adidas_ultraboost.jpg',
    'perfume_adidas.jpg',
    'perfume_nike.jpg',
    'perfume_lacoste.jpg',
    'perfume_ralph.jpg',
    'perfume_ch.jpg',
    'pelota_adidas.jpg',
    'mochila_adidas.jpg',
    'gorra_nike.jpg',
    'medias_adidas.jpg'
];

async function downloadImage(filename, index) {
    return new Promise((resolve, reject) => {
        const url = `https://picsum.photos/seed/${filename}/800/800`;
        const filepath = path.join(outputDir, filename);

        const file = fs.createWriteStream(filepath);
        https.get(url, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // follow redirect
                https.get(response.headers.location, redirectResponse => {
                    redirectResponse.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }).on('error', err => {
                    fs.unlink(filepath, () => reject(err));
                });
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            }
        }).on('error', err => {
            fs.unlink(filepath, () => reject(err));
        });
    });
}

async function main() {
    console.log(`Downloading ${images.length} images...`);
    for (let i = 0; i < images.length; i++) {
        await downloadImage(images[i], i);
        console.log(`Downloaded ${images[i]} (${i + 1}/${images.length})`);
    }
    console.log('Done!');
}

main().catch(console.error);
