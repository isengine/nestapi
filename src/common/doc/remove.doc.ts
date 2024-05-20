import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const RemoveDoc = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Удалить запись по ее id',
    }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'Id номер записи',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Выполнено',
      type: Boolean,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка',
    }),
  );
};
