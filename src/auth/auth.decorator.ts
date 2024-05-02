import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiType } from '@src/common/type/api.type';
import { JwtAuthGuard } from '@src/auth/guard/jwt.guard';
import { GqlAuthGuard } from '@src/auth/guard/gql.guard';
import { FormAuthGuard } from '@src/auth/guard/form.guard';
import { LocalAuthGuard } from '@src/auth/guard/local.guard';

export const Auth = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlAuthGuard));
  }
  if (apiType === 'form') {
    return applyDecorators(UseGuards(FormAuthGuard));
  }
  if (apiType === 'local') {
    return applyDecorators(UseGuards(LocalAuthGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
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
