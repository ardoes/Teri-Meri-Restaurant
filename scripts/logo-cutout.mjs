import sharp from "sharp";

// Read the (webp) logo, make near-white pixels transparent, trim, save as PNG.
const [, , srcPath, outPath] = process.argv;

const HI = 236; // min-channel >= this => transparent (white)
const LO = 205; // feather band

const { data, info } = await sharp(srcPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const m = Math.min(data[i], data[i + 1], data[i + 2]);
  let a = data[i + 3];
  if (m >= HI) a = 0;
  else if (m > LO) a = Math.round((1 - (m - LO) / (HI - LO)) * 255);
  data[i + 3] = Math.min(a, data[i + 3]);
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 10 })
  .png()
  .toFile(outPath);

console.log(`logo written: ${outPath}`);
