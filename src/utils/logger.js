import * as winston from 'winston';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.prettyPrint(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "combined.log", dirname: "logs" }),
        new winston.transports.File({ filename: "error.log", level: "error", dirname: "logs" }),
    ],
});


export function morganMiddleware() {
    const logStream = fs.createWriteStream(path.join(import.meta.dirname, '../../logs/access.log'));

    morgan.format('myformat', '[:date[iso]] ":method :url" :status - [:response-time ms]');

    const response = morgan('myformat', { stream: logStream });

    return response;
}