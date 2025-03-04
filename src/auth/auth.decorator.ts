import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiType } from '@src/common/type/api.type';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { JwtNoBlockAuthGuard } from './guard/jwt_no_block.auth.guard';
import { GqlAuthGuard } from './guard/gql.auth.guard';
import { GqlNoBlockAuthGuard } from './guard/gql_no_block.auth.guard';

export const Auth = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlAuthGuard));
  }
  if (apiType === 'gqlNoBlock') {
    return applyDecorators(UseGuards(GqlNoBlockAuthGuard));
  }
  if (apiType === 'noBlock') {
    return applyDecorators(UseGuards(JwtNoBlockAuthGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
};

export const Self = createParamDecorator(
  async (apiType: ApiType = undefined, context: ExecutionContext) => {
    let request;
    if (apiType === 'gql' || apiType === 'gqlNoBlock') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }
    const user = request?.user;
    if (apiType !== 'noBlock' && apiType !== 'gqlNoBlock') {
      if (!user || user?.id === undefined) {
        throw new ForbiddenException('You have no rights!');
      }
    }
    return user;
  },
);
