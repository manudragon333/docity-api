import {createLogger, format, transports} from 'winston';
import path from 'path';
import 'winston-daily-rotate-file';
import {ErrorMessages} from 'constants/error_constants';
import * as nodeUtil from 'util';

interface ILogger {
    error?(Tag, functionName: string, error: any): void;

    inspect?(payload: any): void;

    debug?(message: string): void;

    warn?(message: string): void;
}

class Logger implements ILogger {
    public logger: any;
    public objectifyError = format((info: any, error?: any) => {
        if (error instanceof Error) {
            info = Object.assign({
                message: info.message,
                stack: error.stack,
            }, info);
        }
        return info;
    });

    constructor() {
        this.logger = createLogger({
            exitOnError: false,
            level: process.env.LOG_LEVEL || 'debug',
            format: format.combine(
                this.objectifyError(),
                format.label({
                    label: path.basename(process.mainModule ? process.mainModule.filename : ''),
                }),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf(this.printf),
            ),
            silent: process.env.NODE_ENV === 'test',
            transports: [
                new transports.Console({
                    format: format.combine(
                        this.objectifyError(),
                        format.colorize(),
                        format.timestamp({
                            format: 'YYYY-MM-DD HH:mm:ss',
                        }),
                        format.printf(this.printf),
                    ),
                }),
                new transports.DailyRotateFile({
                    filename: path.resolve('./logs', 'docity-api-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '50m',
                    maxFiles: '15d',
                }),
            ],
        });
        this.logger.info('Logger initialised!!!');
    }

    public printf(info: any) {
        return `${info.timestamp} ${info.label}[${info.level}]: ${info.message} ${info.stack ? info.stack : ''}`;
    }

    public error(tag: string, functionName: string, error: any): void {
        const message = ErrorMessages.LOG_ERROR_MESSAGE.replace('$tag', tag)
            .replace('$functionName', functionName);
        this.logger.error(message, error);
    }

    public info(message: string, payload?: any): void {
        this.logger.info(message + (payload ? nodeUtil.inspect(payload, {
            depth: 5,
        }) : ''));
    }

    public debug(message: string, payload?: any): void {
        this.logger.debug(message + (payload ? nodeUtil.inspect(payload, {
            depth: 5,
        }) : ''));
    }

    public warn(message: string, payload?: any): void {
        this.logger.warn(message + (payload ? nodeUtil.inspect(payload, {
            depth: 5,
        }) : ''));
    }
}

export const Log = new Logger();
