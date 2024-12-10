import { Hono } from 'hono';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import formatDate from '../utils/formatDate.js';

import * as historyService from '../services/historyService.js';

const app = new Hono();

app.get('/', async (c) => {

    const from = c.req.query('from');
    const to = c.req.query('to');
    const data = await historyService.getReport(from, to);

    return c.json({
        data
    });
});

app.get('/summary', jwtMiddleware, async (c) => {

    // Get User/Doctor ID
    const { id } = c.get('user');

    const data = await historyService.getSummary(id);

    return c.json({
        data: data.persentase
    });

});

export default app;
