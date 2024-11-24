import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import Joi from 'joi';
import ResponseCode from '../utils/responseCode.js';
import checkJson from '../middleware/checkJsonMiddleware.js';
import jwtMiddleware from '../middleware/jwtMiddleware.js';
import { generateToken } from '../utils/jwtUtils.js';

import * as authService from '../services/authService.js';

const app = new Hono();
const prisma = new PrismaClient();

app.post('/register', checkJson, async (c) => {
    try {

        const schema = Joi.object({
            name: Joi.string().max(100).required(),
            username: Joi.string().min(5).max(50).required(),
            password: Joi.string().min(8).max(16).required()
        });

        const { name, username, password } = await schema.validateAsync(await c.req.json(), {
            abortEarly: false
        });

        // Register Service
        const user = await authService.registerUser(name, username, password);
        if (!user) {
            return c.json({
                message: 'Username is already taken'
            }, ResponseCode.HTTP_UNPROCESSABLE_ENTITY);
        }

        return c.json({
            message: 'User registered successfully',
            user: user
        }, ResponseCode.HTTP_CREATED);

    } catch (error) {
        // Gagal Validasi
        const errors = error.details.map((err) => err.message);
        return c.json({
            success: false,
            errors
        }, ResponseCode.HTTP_BAD_REQUEST);
    }
});

app.post('/login', checkJson, async (c) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(5).required(),
            password: Joi.string().min(8).max(16).required()
        });

        const { username, password } = await schema.validateAsync(await c.req.json(), {
            abortEarly: false
        });

        // Login Service
        const user = await authService.loginUser(username, password);

        if (!user) {
            return c.json({
                success: false,
                message: 'Invalid Username or Password'
            }, ResponseCode.HTTP_BAD_REQUEST);
        }

        const token = await generateToken({
            id: user.id,
            name: user.name,
            username: user.username
        });

        return c.json({
            success: true,
            message: 'Login successful',
            token: token
        }, ResponseCode.HTTP_OK);

    } catch (error) {
        const errors = error.details.map((err) => err.message);
        return c.json({
            success: false,
            message: 'Validation Error',
            errors
        }, ResponseCode.HTTP_BAD_REQUEST);
    }
});

app.get('/profile', jwtMiddleware, async (c) => {
    const user = c.get('user');
    return c.json(user);
});

export default app;