import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const source = new URL('../dist/public/', import.meta.url);
const target = new URL('../docs/', import.meta.url);
const origin = 'https://eito1108eito-max.github.io/tohoku-ekiden-2026/';
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
// このサイトは認証やAPIを使わないため、Manus専用の設定ファイルを公開物から除く。
await rm(new URL('api/', target), { recursive: true, force: true });
await rm(new URL('__manus__/', target), { recursive: true, force: true });
await rm(new URL('.gitkeep', target), { force: true });
await rm(new URL('manus-routes.json', target), { force: true });
const entry = new URL('index.html', target);
let html = await readFile(entry, 'utf8');
html = html.replace(/<script\b[^>]*src=["'][^"']*\/api\/platform\/config\.js["'][^>]*><\/script>/g, '');
html = html.replace(/<script\b[^>]*src=["'][^"']*\/__manus__\/[^"']+["'][^>]*><\/script>/g, '');
html = html.replace('</head>', `
<link rel="canonical" href="${origin}" />
<meta property="og:url" content="${origin}" />
<meta property="og:image" content="${origin}mark.svg" />
</head>`);
await writeFile(entry, html);
await writeFile(new URL('.nojekyll', target), '');
await writeFile(new URL('robots.txt', target), `User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml\n`);
await writeFile(new URL('sitemap.xml', target), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}</loc></url></urlset>\n`);
console.log('GitHub Pages公開用ファイルを docs/ に生成しました。');
