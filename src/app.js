import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import logger, { loggerWinston } from './middleware/loggerMiddleware.js';
import 'dotenv/config';

// Router
import indexRouter from './routes/indexRoute.js';
import authRouter from './routes/authRoute.js';
import predictRouter from './routes/predictRoute.js';
import reportRouter from './routes/reportRoute.js';

const app = new Hono();
const port = process.env.APP_PORT || 3000;

// middleware
app.use(logger);
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST']
}));
// Register All Route
app.route('/', indexRouter);
app.route('/auth', authRouter);
app.route('/anemia', predictRouter);
app.route('/report', reportRouter);

// Handle Error
app.notFound((c) => {
  const message = `${c.req.method} ${c.req.path} 404 | Not Found`;
  loggerWinston.info(message);
  return c.json({
    message: 'Not Found'
  }, 404);
});

app.onError((err, c) => {
  const message = `${c.req.method} ${c.req.path} 500 | ${err}`;
  loggerWinston.error(message);
  return c.json({
    message: 'Internal Server Error'
  }, 500);
});

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
