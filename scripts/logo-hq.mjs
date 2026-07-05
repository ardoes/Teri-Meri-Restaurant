import sharp from "sharp";

// Remove white bg, trim, then upscale as cleanly as possible (Lanczos + mild
// sharpen) for the crispest logo the low-res source can give.
const [, , srcPath, outPath] = process.argv;

const HI = 236;
const LO = 205;
const TARGET_W = 1200; // upscaled width

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

const out = await sharp(data, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 10 })
  .resize({ width: TARGET_W, kernel: "lanczos3", withoutEnlargement: false })
  .sharpen({ sigma: 0.8 })
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });

await sharp(out.data).toFile(outPath);
console.log(`logo HQ written: ${outPath} (${out.info.width}x${out.info.height})`);
