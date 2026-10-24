import React from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';
import Home from '../client/src/pages/Home';

const path = new URL('../dist/public/index.html', import.meta.url);
const template = await readFile(path, 'utf8');
const content = renderToString(<Home />);
if (!template.includes('<div id="root"></div>')) throw new Error('静的描画の挿入位置が見つかりません。');
await writeFile(path, template.replace('<div id="root"></div>', `<div id="root">${content}</div>`));
console.log('県大会結果と資料リンクを静的HTMLに描画しました。');
