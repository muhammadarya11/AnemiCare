import { Hono } from 'hono';
import path from 'path';
import fs from 'fs/promises';

const app = new Hono();
const docsDir = path.join(process.cwd(), 'docs');

app.get('/', async (c) => {
    const html = await fs.readFile('../public/index.html', 'utf-8');
    return c.html(html);
});

// app.get('/', swaggerUI({
//     url: '/doc'
// }));

// app.get('/doc', (c) => {
//     const data = fs.readFileSync(path.join(docsDir, 'openapi.json'), 'utf8')
//     return c.json(JSON.parse(data))
// });

export default app;