import * as winston from 'winston';

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
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
