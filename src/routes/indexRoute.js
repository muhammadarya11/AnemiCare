import { Hono } from 'hono';
import path from 'path';
import fs from 'fs/promises';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();
const publicDir = path.join(process.cwd(), 'src/public');

app.get('/', async (c) => {
    const html = await fs.readFile(`${publicDir}/index.html`, 'utf-8');
    console.log(publicDir);
    return c.html(html);
});

app.get('/static/*', serveStatic({ root: './' }));

export default app;