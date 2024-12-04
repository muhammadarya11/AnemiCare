import { Hono } from 'hono';
import ResponseCode from '../utils/responseCode.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import checkJson from '../middleware/checkJsonMiddleware.js';

import * as predictService from '../services/predictService.js';
import * as historyService from '../services/historyService.js';

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

    const { profil_pasien, hasil_lab, diagnosis } = await c.req.json();

    const { id } = c.get('user');

    // Save Data Pasien
    const patient = await predictService.savePatient(profil_pasien);

    // Save Hasil Diagnosis
    const diagnosisResult = await predictService.saveDiagnosis(id, patient.id, hasil_lab, diagnosis);

    // Save Data Riwayat
    historyService.saveHistory({ patientId: patient.id, dianosisId: diagnosisResult.id });

    return c.json({
        success: true,
        message: 'Prediction saved successfully.',
        data: diagnosisResult
    }, ResponseCode.HTTP_OK);
});

export default app;