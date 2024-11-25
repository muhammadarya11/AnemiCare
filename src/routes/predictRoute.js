import { Hono } from 'hono';
import ResponseCode from '../utils/responseCode.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import checkJson from '../middleware/checkJsonMiddleware.js';

import * as predictService from '../services/predictService.js';

const app = new Hono();

app.post('/predict', jwtMiddleware, checkJson, async (c) => {

    const { data } = await c.req.json();

    const result = await predictService.predictAnemia(data);

    if (!result) {
        throw Error('Can\'t connect API Service');
    }

    return c.json({
        success: true,
        message: 'Prediction completed successfully.',
        data: result
    }, ResponseCode.HTTP_OK);
});

export default app;