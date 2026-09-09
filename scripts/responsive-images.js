const fs = require('fs');
const path = require('path');

const manifestPath = path.join(hexo.base_dir, 'scripts', '.responsive-images.json');
let manifest = {};

try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch {
  // Direct `hexo generate` still works before the optimization script runs.
}

function attribute(attributes, name) {
  const match = attributes.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? match[2] : '';
}

function withoutAttributes(attributes, names) {
  let result = attributes;
  for (const name of names) {
    result = result.replace(new RegExp(`\\s+${name}\\s*=\\s*(["']).*?\\1`, 'ig'), '');
  }
  return result;
}

function srcset(variants) {
  return variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ');
}

function responsiveMarkup(original, attributes, source, first = false) {
  const entry = manifest[source];
  if (!entry || (!entry.avif.length && !entry.webp.length)) return original;

  const isFirst = first;
  const alt = attribute(attributes, 'alt');
  const cleanAttributes = withoutAttributes(attributes, [
    'src', 'srcset', 'sizes', 'loading', 'fetchpriority', 'width', 'height'
  ]).trim();
  const fallback = entry.webp[0] || entry.avif[0];
  const priority = isFirst ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  const dimensions = entry.width && entry.height
    ? ` width="${entry.width}" height="${entry.height}"`
    : '';
  const altAttribute = alt ? ` alt="${alt.replace(/"/g, '&quot;')}"` : ' alt=""';
  const preserved = cleanAttributes.replace(/\s*alt\s*=\s*(["']).*?\1/ig, '').trim();
  const preservedAttributes = preserved ? ` ${preserved}` : '';

  return `<picture><source type="image/avif" srcset="${srcset(entry.avif)}"><source type="image/webp" srcset="${srcset(entry.webp)}"><img${preservedAttributes}${altAttribute} data-full-src="${source}" src="${fallback.url}" sizes="(max-width: 48rem) 100vw, 768px"${dimensions}${priority} decoding="async"></picture>`;
}

function escapeAttribute(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

hexo.extend.helper.register('responsive_image', (source, alt, options = {}) => {
  const attributes = ` itemprop="image" alt="${escapeAttribute(alt)}"`;
  const fallback = `<img${attributes} src="${source}" loading="${options.loading || 'lazy'}">`;
  return responsiveMarkup(fallback, attributes, source, options.loading === 'eager');
});

hexo.extend.filter.register('after_post_render', (data) => {
  responsiveMarkup.imageIndex = 0;
  data.content = data.content.replace(
    /<img\b([^>]*?)\bsrc\s*=\s*(["'])(\/images\/[^"']+\.(?:jpe?g|png))\2([^>]*)>/gi,
    (full, before, quote, source, after) => {
      responsiveMarkup.imageIndex = (responsiveMarkup.imageIndex || 0) + 1;
      return responsiveMarkup(full, `${before}${after}`, source, responsiveMarkup.imageIndex === 1);
    }
  );
  return data;
}, 9);
