import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Data = createParamDecorator(
  async (arg = '', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { body, query } = request;
    const data = { ...query, ...body };
    if (!arg) {
      return data;
    }
    return data[arg];
  },
);
