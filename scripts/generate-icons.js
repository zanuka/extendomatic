import { mkdirSync } from "fs";
import { join } from "path";
import sharp from "sharp";

// Ensure the assets directory exists
const assetsDir = "./public/assets";
try {
  mkdirSync(assetsDir, { recursive: true });
} catch (error) {
  // Directory already exists, that's fine
}

async function generateIcon(size, backgroundColor = "#FF69B4") {
  const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
            <text 
                x="50%" 
                y="70%" 
                font-family="Arial" 
                font-size="${size * 0.6}" 
                font-weight="bold" 
                fill="black" 
                text-anchor="middle" 
                dominant-baseline="middle"
            >LD</text>
        </svg>
    `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

// Generate icons for all recommended sizes
async function generateAllIcons() {
  const sizes = [16, 24, 32, 48, 128];

  for (const size of sizes) {
    const buffer = await generateIcon(size);
    const filepath = join(assetsDir, `icon-${size}.png`);
    await sharp(buffer).toFile(filepath);
    console.log(`Generated icon: ${filepath}`);
  }
}

generateAllIcons().catch(console.error);
