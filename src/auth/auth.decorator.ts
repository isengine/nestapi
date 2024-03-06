import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiType } from '@src/typeorm/type/api.type';
import { JwtAuthGuard } from '@src/auth/guard/jwt.guard';
import { GqlAuthGuard } from '@src/auth/guard/gql.guard';
import { GqlFromClientAuthGuard } from '@src/auth/guard/gqlFromClient.guard';
import { JwtFromClientAuthGuard } from '@src/auth/guard/jwtFromClient.guard';

export const Auth = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlAuthGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
};

export const FromClient = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlFromClientAuthGuard));
  }
  return applyDecorators(UseGuards(JwtFromClientAuthGuard));
};

export const Self = createParamDecorator(
  async (apiType: ApiType = undefined, context: ExecutionContext) => {
    if (apiType === 'gql') {
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;
      return req.user?.id;
    }
    const request = context.switchToHttp().getRequest();
    return request.user?.id;
  },
);
