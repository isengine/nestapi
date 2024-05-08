import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiType } from '@src/common/type/api.type';
import { JwtAuthGuard } from '@src/strategies/guard/jwt.guard';
import { GqlAuthGuard } from '@src/strategies/guard/gql.guard';

export const Auth = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlAuthGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
};

export const Data = createParamDecorator(
  async (arg = '', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { body, query } = request;
    const data = { ...query, ...body };
    let result = arg ? data[arg] : data;
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (e) {
        console.log(e);
      }
    }
    return result;
  },
);

export const Self = createParamDecorator(
  async (apiType: ApiType = undefined, context: ExecutionContext) => {
    let request;
    if (apiType === 'gql') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }
    const user = request?.user;
    if (!user || user?.id === undefined) {
      throw new ForbiddenException('You have no rights!');
    }
    return user;
  },
);
