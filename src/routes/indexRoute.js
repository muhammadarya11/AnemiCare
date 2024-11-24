import { Hono } from 'hono';
import path from 'path';

const app = new Hono();
const docsDir = path.join(process.cwd(), 'docs');

app.get('/', (c) => {
    return c.json({
        success: true,
        message: 'App Running Successfully'
    });
});

// app.get('/', swaggerUI({
//     url: '/doc'
// }));

// app.get('/doc', (c) => {
//     const data = fs.readFileSync(path.join(docsDir, 'openapi.json'), 'utf8')
//     return c.json(JSON.parse(data))
// });

export default app;