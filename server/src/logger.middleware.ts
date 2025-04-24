import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: Logger) {}

    use(request: Request, response: Response, next: NextFunction) {
        const { method, url } = request;
        this.logger.debug(`[${method}] ${url}`);
        next();
    }
}