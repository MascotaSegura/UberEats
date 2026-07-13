import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, 'public/favicon.svg');
const outDir = resolve(__dirname, 'public/icons');

mkdirSync(outDir, { recursive: true });

const svgData = readFileSync(svgPath, 'utf-8');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

for (const size of sizes) {
  const resvg = new Resvg(svgData, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const outPath = resolve(outDir, `icon-${size}.png`);
  writeFileSync(outPath, pngBuffer);
  console.log(`✓ Generated icon-${size}.png (${pngBuffer.length} bytes)`);
}

console.log('\nAll icons generated in public/icons/');
