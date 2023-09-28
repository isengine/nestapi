import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TypeData } from '@src/users/users.interface';

export const User = createParamDecorator(
  (data: TypeData, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.body;
    return data ? user[data] : user;
  },
);

export const Self = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
