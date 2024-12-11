import { Hono } from 'hono';
import 'dotenv/config';
import Joi from 'joi';
import ResponseCode from '../utils/responseCode.js';
import checkJson from '../middleware/checkJsonMiddleware.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import { generateToken } from '../utils/jwtUtils.js';

import * as authService from '../services/authService.js';

const app = new Hono();

app.post('/register', checkJson, async (c) => {
    try {

        const schema = Joi.object({
            name: Joi.string().max(100).required().messages({
                'string.empty': 'Nama tidak boleh kosong.',
                'string.max': 'Nama tidak boleh lebih dari 100 karakter.',
                'any.required': 'Nama wajib diisi.'
            }),
            username: Joi.string().min(5).max(50).required().messages({
                'string.empty': 'Username tidak boleh kosong.',
                'string.min': 'Username harus memiliki minimal 5 karakter.',
                'string.max': 'Username tidak boleh lebih dari 50 karakter.',
                'any.required': 'Username wajib diisi.'
            }),
            password: Joi.string().min(8).max(16).required().messages({
                'string.empty': 'Password tidak boleh kosong.',
                'string.min': 'Password harus memiliki minimal 8 karakter.',
                'string.max': 'Password tidak boleh lebih dari 16 karakter.',
                'any.required': 'Password wajib diisi.'
            })
        });

        const { name, username, password } = await schema.validateAsync(await c.req.json(), {
            abortEarly: false
        });

        // Register Service
        const user = await authService.registerUser(name, username, password);

        if (!user) {
            return c.json({
                status: 'error',
                message: 'Username sudah digunakan. Silakan pilih username lain.',
                status_code: ResponseCode.HTTP_UNPROCESSABLE_ENTITY
            }, ResponseCode.HTTP_UNPROCESSABLE_ENTITY);
        }

        return c.json({
            status: 'success',
            message: 'Pengguna berhasil didaftarkan.',
            data: {
                user
            },
            status_code: ResponseCode.HTTP_CREATED
        }, ResponseCode.HTTP_CREATED);


    } catch (error) {
        const formattedErrors = error.details.map(err => ({
            field: err.context.key,
            error: err.message
        }));
        return c.json({
            status: 'error',
            message: 'Payload JSON tidak valid.',
            details: formattedErrors,
            status_code: ResponseCode.HTTP_BAD_REQUEST
        }, ResponseCode.HTTP_BAD_REQUEST);
    }
});

app.post('/login', checkJson, async (c) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(5).required().messages({
                'string.empty': 'Username tidak boleh kosong.',
                'string.min': 'Username harus memiliki minimal 5 karakter.',
                'any.required': 'Username wajib diisi.'
            }),
            password: Joi.string().min(8).max(16).required().messages({
                'string.empty': 'Password tidak boleh kosong.',
                'string.min': 'Password harus memiliki minimal 8 karakter.',
                'string.max': 'Password tidak boleh lebih dari 16 karakter.',
                'any.required': 'Password wajib diisi.'
            })
        });

        const { username, password } = await schema.validateAsync(await c.req.json(), {
            abortEarly: false
        });

        // Login Service
        const user = await authService.loginUser(username, password);

        if (!user) {
            return c.json({
                status: 'error',
                message: 'Username atau Password salah.',
                status_code: ResponseCode.HTTP_BAD_REQUEST
            }, ResponseCode.HTTP_BAD_REQUEST);
        }

        const token = await generateToken({
            id: user.id,
            name: user.name,
            username: user.username
        });

        return c.json({
            status: 'success',
            message: 'Berhasil login.',
            token: token,
            status_code: ResponseCode.HTTP_OK
        }, ResponseCode.HTTP_OK);

    } catch (error) {
        const formattedErrors = error.details.map(err => ({
            field: err.context.key,
            error: err.message
        }));
        return c.json({
            status: 'error',
            message: 'Payload JSON tidak valid.',
            details: formattedErrors,
            status_code: ResponseCode.HTTP_BAD_REQUEST
        }, ResponseCode.HTTP_BAD_REQUEST);
    }
});

app.get('/profile', jwtMiddleware, async (c) => {
    const user = c.get('user');
    return c.json({
        status: 'success',
        message: 'Berhasil mengambil data profil.',
        data: user,
        status_code: ResponseCode.HTTP_OK
    });
});

export default app;