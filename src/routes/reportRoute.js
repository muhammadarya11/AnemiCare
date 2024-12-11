import { Hono } from 'hono';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import formatDate from '../utils/formatDate.js';

import * as historyService from '../services/historyService.js';
import ResponseCode from '../utils/responseCode.js';

const app = new Hono();

app.get('/', async (c) => {

    const from = c.req.query('from');
    const to = c.req.query('to');
    const data = await historyService.getReport(from, to);

    return c.json({
        status: 'success',
        message: 'Berhasil mengambil data.',
        data,
        status_code: ResponseCode.HTTP_OK
    }, ResponseCode.HTTP_OK);
});

app.get('/summary', jwtMiddleware, async (c) => {

    // Get User/Doctor ID
    const { id } = c.get('user');

    const data = await historyService.getSummary(id);

    return c.json({
        status: 'success',
        message: 'Berhasil mengambil data.',
        data: data,
        status_code: ResponseCode.HTTP_OK
    }, ResponseCode.HTTP_OK);

});

export default app;
