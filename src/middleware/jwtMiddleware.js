import { verifyToken } from '../utils/jwtUtils.js';

const jwtMiddleware = async (c, next) => {

    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
        return c.json({
            'message': 'Unauthorized - Invalid or missing token'
        }, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = await verifyToken(token);
        c.set('user', payload.data);
        await next();
    } catch (error) {
        return c.json({
            'message': 'Unauthorized - Invalid or missing token'
        }, 401);
    }
};

export default jwtMiddleware;