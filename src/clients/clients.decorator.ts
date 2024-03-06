import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiType } from '@src/typeorm/type/api.type';
import { JwtClientsGuard } from '@src/clients/guard/jwt.clients.guard';
import { GqlClientsGuard } from '@src/clients/guard/gql.clients.guard';

export const Client = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlClientsGuard));
  }
  return applyDecorators(UseGuards(JwtClientsGuard));
};

export const SelfClient = createParamDecorator(
  async (apiType: ApiType = undefined, context: ExecutionContext) => {
    if (apiType === 'gql') {
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;
      return req.user;
    }
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
