import { sign, verify } from 'hono/jwt';
import 'dotenv/config';

const generateToken = async (data) => {
    return await sign({
        exp: Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRED_TIME,
        data: data
    }, process.env.JWT_SECRET);
};

const verifyToken = async (token) => {
    return await verify(token, process.env.JWT_SECRET);
};

export { generateToken, verifyToken };
