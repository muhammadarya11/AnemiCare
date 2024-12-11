import { verifyToken } from '../utils/jwtUtils.js';
import ResponseCode from '../utils/responseCode.js';

const jwtMiddleware = async (c, next) => {

    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
        return c.json({
            status: 'error',
            message: 'Unauthorized - Token tidak valid atau tidak ada.',
            status_code: ResponseCode.HTTP_UNAUTHORIZED
        }, ResponseCode.HTTP_UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = await verifyToken(token);
        c.set('user', payload.data);
        await next();
    } catch (error) {
        return c.json({
            status: 'error',
            message: 'Unauthorized - Token tidak valid atau tidak ada.',
            status_code: ResponseCode.HTTP_UNAUTHORIZED
        }, ResponseCode.HTTP_UNAUTHORIZED);
    }
};

export default jwtMiddleware;