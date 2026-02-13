const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

async function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Load Rob Jetten photo
  const photo = await loadImage(
    path.join(__dirname, "../public/persons/rob-jetten.jpg")
  );

  // Crop to square (center crop from top)
  const srcSize = Math.min(photo.width, photo.height);
  const srcX = (photo.width - srcSize) / 2;
  const srcY = 0;

  // Draw square photo (full bleed, no circle)
  ctx.drawImage(photo, srcX, srcY, srcSize, srcSize, 0, 0, size, size);

  // Dark overlay for contrast
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, size, size);

  // Draw large "K" in the center-left
  const fontSize = size * 0.7;
  ctx.font = `900 ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // White outline/shadow
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.lineWidth = size * 0.03;
  ctx.strokeText("K", size * 0.5, size * 0.52);

  // White fill
  ctx.fillStyle = "#ffffff";
  ctx.fillText("K", size * 0.5, size * 0.52);

  // Save
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${outputPath} (${size}x${size})`);
}

async function main() {
  const iconsDir = path.join(__dirname, "../public/icons");
  await generateIcon(192, path.join(iconsDir, "icon-192.png"));
  await generateIcon(512, path.join(iconsDir, "icon-512.png"));
}

main().catch(console.error);
