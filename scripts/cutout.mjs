import Jimp from "jimp";

// Remove a (near) black background by flood-filling transparency from the
// image borders inward. Interior dark pixels that are fenced off by the bright
// bowl rim are preserved, so we don't punch holes in the food.
const [, , srcPath, outPath] = process.argv;

const LO = 28; // <= this luminance => fully transparent
const HI = 90; // traverse/feather up to this luminance

const img = await Jimp.read(srcPath);
const { width, height, data } = img.bitmap;

const lumAt = (idx) =>
  Math.max(data[idx], data[idx + 1], data[idx + 2]);

const visited = new Uint8Array(width * height);
const stack = [];

const pushBorder = (x, y) => stack.push(y * width + x);
for (let x = 0; x < width; x++) {
  pushBorder(x, 0);
  pushBorder(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushBorder(0, y);
  pushBorder(width - 1, y);
}

while (stack.length) {
  const p = stack.pop();
  if (visited[p]) continue;
  visited[p] = 1;

  const idx = p * 4;
  const lum = lumAt(idx);
  if (lum > HI) continue; // hit the bright rim — stop

  // feather alpha across the LO..HI band, fully clear below LO
  let a = 0;
  if (lum > LO) a = Math.round(((lum - LO) / (HI - LO)) * 255);
  data[idx + 3] = a;

  const x = p % width;
  const y = (p - x) / width;
  if (x > 0) stack.push(p - 1);
  if (x < width - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - width);
  if (y < height - 1) stack.push(p + width);
}

await img.writeAsync(outPath);
console.log(`cutout written: ${outPath} (${width}x${height})`);
