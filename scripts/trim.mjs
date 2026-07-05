import Jimp from "jimp";

// Trim the uniform transparent border so the dish is centered in its own box.
const p = process.argv[2];
const img = await Jimp.read(p);
img.autocrop({ tolerance: 0.001, cropOnlyFrames: false, cropSymmetric: false });
await img.writeAsync(p);
console.log(`trimmed: ${img.bitmap.width}x${img.bitmap.height}`);
