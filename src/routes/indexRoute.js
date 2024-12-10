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
    // return c.text('wkwk');
});

app.get('/static/*', serveStatic({ root: './' }));

// app.get('/', swaggerUI({
//     url: '/doc'
// }));

// app.get('/doc', (c) => {
//     const data = fs.readFileSync(path.join(docsDir, 'openapi.json'), 'utf8')
//     return c.json(JSON.parse(data))
// });

export default app;