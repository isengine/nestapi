import {
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApiType } from '@src/common/type/api.type';
import { GqlPersonsGuard } from './guard/gql.persons.guard';
import { JwtPersonsGuard } from './guard/jwt.persons.guard';

export const Person = (apiType: ApiType = undefined) => {
  if (apiType === 'gql') {
    return applyDecorators(UseGuards(GqlPersonsGuard));
  }
  return applyDecorators(UseGuards(JwtPersonsGuard));
};

export const SelfPerson = createParamDecorator(
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
