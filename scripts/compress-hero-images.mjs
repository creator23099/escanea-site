import sharp from "sharp";
import { statSync } from "fs";
import { join } from "path";

const IMAGES_DIR = "public/images";
const MAX_BYTES = 200 * 1024;

const HERO_IMAGES = [
  { input: "fleet-medellin-horizontal.jpg", output: "fleet-medellin-horizontal.webp", maxWidth: 1920 },
  { input: "fleet-medellin-vertical.jpg", output: "fleet-medellin-vertical.webp", maxWidth: 1080 },
  { input: "marcas-hero.jpg", output: "marcas-hero.webp", maxWidth: 1920 },
  { input: "marcas-hero-vertical.jpg", output: "marcas-hero-vertical.webp", maxWidth: 1080 },
  { input: "conductores-hero.jpg", output: "conductores-hero.webp", maxWidth: 1920 },
  { input: "conductores-hero-vertical.jpg", output: "conductores-hero-vertical.webp", maxWidth: 1080 },
];

async function compressHero({ input, output, maxWidth }) {
  const inputPath = join(IMAGES_DIR, input);
  const outputPath = join(IMAGES_DIR, output);
  const meta = await sharp(inputPath).metadata();

  let width = meta.width;
  let height = meta.height;
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  let quality = 82;
  let size = Infinity;

  while (quality >= 40) {
    await sharp(inputPath)
      .resize(width, height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(outputPath);

    size = statSync(outputPath).size;
    if (size <= MAX_BYTES) break;
    quality -= 5;
  }

  if (size > MAX_BYTES) {
    // Further downscale if still too large
    let scale = 0.9;
    while (size > MAX_BYTES && scale >= 0.5) {
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      await sharp(inputPath)
        .resize(w, h, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 75, effort: 6 })
        .toFile(outputPath);
      size = statSync(outputPath).size;
      scale -= 0.05;
    }
  }

  const kb = (size / 1024).toFixed(1);
  console.log(`${output}: ${kb} KB (${width}x${height} @ q${quality})`);
  return { output, size, width, height };
}

const results = [];
for (const hero of HERO_IMAGES) {
  results.push(await compressHero(hero));
}

console.log("\nSummary:");
for (const r of results) {
  const ok = r.size <= MAX_BYTES ? "OK" : "OVER";
  console.log(`  ${r.output}: ${(r.size / 1024).toFixed(1)} KB [${ok}]`);
}
