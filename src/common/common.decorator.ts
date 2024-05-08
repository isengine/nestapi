import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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
