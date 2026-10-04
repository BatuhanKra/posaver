import { cpSync, mkdirSync, rmSync } from 'node:fs';

const from = 'node_modules/@sveltia/cms/dist';
const to = 'public/admin';

mkdirSync(to, { recursive: true });
rmSync(`${to}/chunks`, { recursive: true, force: true });
cpSync(`${from}/sveltia-cms.js`, `${to}/sveltia-cms.js`);
cpSync(`${from}/chunks`, `${to}/chunks`, { recursive: true, filter: (src) => !src.endsWith('.map') });
