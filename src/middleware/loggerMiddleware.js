import winston from 'winston';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

const loggerWinston = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss',
        }),
        winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(logDir, 'app.log'),
            level: 'info'
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        })
    ]
});

const logger = async (c, next) => {
    await next();
    const message = `${c.req.method} ${c.req.path} ${c.res.status}`;
    loggerWinston.info(message);
};

export default logger;
export { loggerWinston };