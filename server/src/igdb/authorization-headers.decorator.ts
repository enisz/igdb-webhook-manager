import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const AuthorizationHeaders = (dto: new () => object) => 
  createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;

    const filteredHeaders = Object.keys(new dto()).reduce((acc, key) => {
      acc[key] = headers[key.toLowerCase()];
      return acc;
    }, {} as Record<string, any>);

    const instance = plainToInstance(dto, filteredHeaders) as object;
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return instance;
  })();
