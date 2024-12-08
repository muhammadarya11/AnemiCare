import { Hono } from 'hono';
import ResponseCode from '../utils/responseCode.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';

import * as historyService from '../services/historyService.js';

const app = new Hono();

app.get('/', async (c) => {

    const data = await historyService.getReport();

    return c.json({
        data: data
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
