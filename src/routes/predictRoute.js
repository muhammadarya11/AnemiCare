import { Hono } from 'hono';
import ResponseCode from '../utils/responseCode.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import checkJson from '../middleware/checkJsonMiddleware.js';

import * as predictService from '../services/predictService.js';
import * as historyService from '../services/historyService.js';
import Joi from 'joi';

const app = new Hono();

app.post('/predict', jwtMiddleware, checkJson, async (c) => {
    try {
        const schema = Joi.object({
            profil_pasien: Joi.object({
                nama: Joi.string().required().messages({
                    'string.empty': 'Nama tidak boleh kosong.',
                    'any.required': 'Nama wajib diisi.'
                }),
                usia: Joi.number().integer().min(1).required().messages({
                    'number.base': 'Usia harus berupa angka.',
                    'number.integer': 'Usia harus berupa bilangan bulat.',
                    'number.min': 'Usia minimal adalah 1.',
                    'any.required': 'Usia wajib diisi.'
                }),
                no_telp: Joi.string().required().messages({
                    'string.empty': 'Nomor telepon tidak boleh kosong.',
                    'any.required': 'Nomor telepon wajib diisi.'
                }),
                gender: Joi.string().valid('LAKI_LAKI', 'PEREMPUAN').required().messages({
                    'any.only': "Gender harus berupa 'LAKI_LAKI' atau 'PEREMPUAN'.",
                    'any.required': 'Gender wajib diisi.'
                })
            }).required().messages({
                'object.base': 'Profil pasien harus berupa objek.',
                'any.required': 'Profil pasien wajib diisi.'
            }),
            hasil_lab: Joi.object({
                WBC: Joi.number().required().messages({
                    'number.base': 'WBC harus berupa angka.',
                    'any.required': 'WBC wajib diisi.'
                }),
                LYMp: Joi.number().required().messages({
                    'number.base': 'LYMp harus berupa angka.',
                    'any.required': 'LYMp wajib diisi.'
                }),
                NEUTp: Joi.number().required().messages({
                    'number.base': 'NEUTp harus berupa angka.',
                    'any.required': 'NEUTp wajib diisi.'
                }),
                LYMn: Joi.number().required().messages({
                    'number.base': 'LYMn harus berupa angka.',
                    'any.required': 'LYMn wajib diisi.'
                }),
                NEUTn: Joi.number().required().messages({
                    'number.base': 'NEUTn harus berupa angka.',
                    'any.required': 'NEUTn wajib diisi.'
                }),
                RBC: Joi.number().required().messages({
                    'number.base': 'RBC harus berupa angka.',
                    'any.required': 'RBC wajib diisi.'
                }),
                HGB: Joi.number().required().messages({
                    'number.base': 'HGB harus berupa angka.',
                    'any.required': 'HGB wajib diisi.'
                }),
                HCT: Joi.number().required().messages({
                    'number.base': 'HCT harus berupa angka.',
                    'any.required': 'HCT wajib diisi.'
                }),
                MCV: Joi.number().required().messages({
                    'number.base': 'MCV harus berupa angka.',
                    'any.required': 'MCV wajib diisi.'
                }),
                MCH: Joi.number().required().messages({
                    'number.base': 'MCH harus berupa angka.',
                    'any.required': 'MCH wajib diisi.'
                }),
                MCHC: Joi.number().required().messages({
                    'number.base': 'MCHC harus berupa angka.',
                    'any.required': 'MCHC wajib diisi.'
                }),
                PLT: Joi.number().required().messages({
                    'number.base': 'PLT harus berupa angka.',
                    'any.required': 'PLT wajib diisi.'
                }),
                PDW: Joi.number().required().messages({
                    'number.base': 'PDW harus berupa angka.',
                    'any.required': 'PDW wajib diisi.'
                }),
                PCT: Joi.number().required().messages({
                    'number.base': 'PCT harus berupa angka.',
                    'any.required': 'PCT wajib diisi.'
                })
            }).required().messages({
                'object.base': 'Hasil lab harus berupa objek.',
                'any.required': 'Hasil lab wajib diisi.'
            })
        });

        // Validasi Payload
        const { hasil_lab } = await schema.validateAsync(await c.req.json(), {
            abortEarly: false
        });

        // Mapping data untuk predict
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
    } catch (error) {
        const formattedErrors = error.details.map(err => ({
            field: err.context.key,
            error: err.message
        }));
        return c.json({
            status: 'error',
            message: 'Invalid JSON Payload',
            details: formattedErrors
        }, ResponseCode.HTTP_BAD_REQUEST);
    }
});

app.post('/predict/save', jwtMiddleware, checkJson, async (c) => {

    try {
        const schema = Joi.object({
            profil_pasien: Joi.object({
                nama: Joi.string().required().messages({
                    'string.empty': 'Nama tidak boleh kosong.',
                    'any.required': 'Nama wajib diisi.'
                }),
                usia: Joi.number().integer().min(1).required().messages({
                    'number.base': 'Usia harus berupa angka.',
                    'number.integer': 'Usia harus berupa bilangan bulat.',
                    'number.min': 'Usia minimal adalah 1.',
                    'any.required': 'Usia wajib diisi.'
                }),
                no_telp: Joi.string().required().messages({
                    'string.empty': 'Nomor telepon tidak boleh kosong.',
                    'any.required': 'Nomor telepon wajib diisi.'
                }),
                gender: Joi.string().valid('LAKI_LAKI', 'PEREMPUAN').required().messages({
                    'any.only': "Gender harus berupa 'LAKI_LAKI' atau 'PEREMPUAN'.",
                    'any.required': 'Gender wajib diisi.'
                })
            }).required().messages({
                'object.base': 'Profil pasien harus berupa objek.',
                'any.required': 'Profil pasien wajib diisi.'
            }),
            hasil_lab: Joi.object({
                WBC: Joi.number().required().messages({
                    'number.base': 'WBC harus berupa angka.',
                    'any.required': 'WBC wajib diisi.'
                }),
                LYMp: Joi.number().required().messages({
                    'number.base': 'LYMp harus berupa angka.',
                    'any.required': 'LYMp wajib diisi.'
                }),
                NEUTp: Joi.number().required().messages({
                    'number.base': 'NEUTp harus berupa angka.',
                    'any.required': 'NEUTp wajib diisi.'
                }),
                LYMn: Joi.number().required().messages({
                    'number.base': 'LYMn harus berupa angka.',
                    'any.required': 'LYMn wajib diisi.'
                }),
                NEUTn: Joi.number().required().messages({
                    'number.base': 'NEUTn harus berupa angka.',
                    'any.required': 'NEUTn wajib diisi.'
                }),
                RBC: Joi.number().required().messages({
                    'number.base': 'RBC harus berupa angka.',
                    'any.required': 'RBC wajib diisi.'
                }),
                HGB: Joi.number().required().messages({
                    'number.base': 'HGB harus berupa angka.',
                    'any.required': 'HGB wajib diisi.'
                }),
                HCT: Joi.number().required().messages({
                    'number.base': 'HCT harus berupa angka.',
                    'any.required': 'HCT wajib diisi.'
                }),
                MCV: Joi.number().required().messages({
                    'number.base': 'MCV harus berupa angka.',
                    'any.required': 'MCV wajib diisi.'
                }),
                MCH: Joi.number().required().messages({
                    'number.base': 'MCH harus berupa angka.',
                    'any.required': 'MCH wajib diisi.'
                }),
                MCHC: Joi.number().required().messages({
                    'number.base': 'MCHC harus berupa angka.',
                    'any.required': 'MCHC wajib diisi.'
                }),
                PLT: Joi.number().required().messages({
                    'number.base': 'PLT harus berupa angka.',
                    'any.required': 'PLT wajib diisi.'
                }),
                PDW: Joi.number().required().messages({
                    'number.base': 'PDW harus berupa angka.',
                    'any.required': 'PDW wajib diisi.'
                }),
                PCT: Joi.number().required().messages({
                    'number.base': 'PCT harus berupa angka.',
                    'any.required': 'PCT wajib diisi.'
                })
            }).required().messages({
                'object.base': 'Hasil lab harus berupa objek.',
                'any.required': 'Hasil lab wajib diisi.'
            }),
            diagnosis: Joi.string().required().messages({
                'string.empty': 'Diagnosis tidak boleh kosong.',
                'any.required': 'Diagnosis wajib diisi.'
            })
        });
        const { profil_pasien, hasil_lab, diagnosis } = await schema.validateAsync(await c.req.json(), {
            abortEarly: false
        });

        const { id } = c.get('user');

        // Save Data Pasien
        const patient = await predictService.savePatient(profil_pasien);

        // Save Hasil Diagnosis
        const diagnosisResult = await predictService.saveDiagnosis(id, patient.id, hasil_lab, diagnosis);

        // Save Data Riwayat
        historyService.saveHistory({ doctorId: id, patientId: patient.id, dianosisId: diagnosisResult.id });

        return c.json({
            success: true,
            message: 'Prediction saved successfully.',
            data: diagnosisResult
        }, ResponseCode.HTTP_OK);
    } catch (error) {
        const formattedErrors = error.details.map(err => ({
            field: err.context.key,
            error: err.message
        }));
        return c.json({
            status: 'error',
            message: 'Invalid JSON Payload',
            details: formattedErrors
        }, ResponseCode.HTTP_BAD_REQUEST);
    }


});

export default app;