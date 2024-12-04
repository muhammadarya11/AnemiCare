import { Hono } from 'hono';
import ResponseCode from '../utils/responseCode.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import checkJson from '../middleware/checkJsonMiddleware.js';

import * as predictService from '../services/predictService.js';

const app = new Hono();

app.post('/predict', jwtMiddleware, checkJson, async (c) => {

    const { hasil_lab } = await c.req.json();

    const urutanKunci = [
        'WBC', 'LYMp', 'NEUTp', 'LYMn', 'NEUTn', 'RBC', 'HGB',
        'HCT', 'MCV', 'MCH', 'MCHC', 'PLT', 'PDW', 'PCT'
    ];

    const arrayInput = urutanKunci.map(key => hasil_lab[key]);

    const result = await predictService.predictAnemia(arrayInput);

    if (!result) {
        throw Error('Can\'t connect API Service');
    }

    return c.json({
        success: true,
        message: 'Prediction completed successfully.',
        data: result
    }, ResponseCode.HTTP_OK);
});

app.post('/predict/save', jwtMiddleware, checkJson, async (c) => {

    const data = await c.req.json();

    return c.json({
        success: true,
        message: 'Prediction saved successfully.',
        data: data
    }, ResponseCode.HTTP_OK);
});

export default app;