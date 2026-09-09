import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoot = path.join(root, 'source', 'images');
const outputRoot = path.join(sourceRoot, 'optimized');
const manifestPath = path.join(root, 'scripts', '.responsive-images.json');
const sizes = [480, 960, 1600];
const formats = ['avif', 'webp'];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png']);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'optimized') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (imageExtensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
  }
  return files;
}

function publicUrl(absolutePath) {
  const relative = path.relative(sourceRoot, absolutePath).split(path.sep).join('/');
  return `/images/${relative}`;
}

function outputPath(inputPath, size, format) {
  const relative = path.relative(sourceRoot, inputPath);
  const directory = path.dirname(relative);
  const stem = path.basename(relative, path.extname(relative));
  return path.join(outputRoot, directory, `${stem}-${size}.${format}`);
}

async function isFresh(output, input) {
  try {
    const [outStat, inputStat] = await Promise.all([fs.stat(output), fs.stat(input)]);
    return outStat.mtimeMs >= inputStat.mtimeMs;
  } catch {
    return false;
  }
}

async function buildVariant(input, output, size, format) {
  await fs.mkdir(path.dirname(output), { recursive: true });
  if (await isFresh(output, input)) return;
  let image = sharp(input, { failOn: 'none' }).rotate().resize({
    width: size,
    height: size,
    fit: 'inside',
    withoutEnlargement: true
  });
  if (format === 'avif') image = image.avif({ quality: 50, effort: 4 });
  else image = image.webp({ quality: 78, effort: 4 });
  await image.toFile(output);
}

async function runJobs(jobs, concurrency = 4) {
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const job = jobs[next++];
      await buildVariant(job.input, job.output, job.size, job.format);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
}

const files = await walk(sourceRoot);
const manifest = {};
const jobs = [];

for (const input of files) {
  const metadata = await sharp(input, { failOn: 'none' }).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const entry = { width, height, avif: [], webp: [] };

  if (width > 256 && height > 256) {
    for (const format of formats) {
      for (const size of sizes) {
        const output = outputPath(input, size, format);
        jobs.push({ input, output, size, format });
        const actualWidth = Math.min(width, size);
        if (!entry[format].some((variant) => variant.width === actualWidth)) {
          entry[format].push({
            url: `/images/optimized/${path.relative(outputRoot, output).split(path.sep).join('/')}`,
            width: actualWidth
          });
        }
      }
    }
  }
  manifest[publicUrl(input)] = entry;
}

await runJobs(jobs);
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Optimized ${files.length} source images (${Object.keys(manifest).length} manifest entries).`);
