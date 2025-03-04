import { applyDecorators } from '@nestjs/common';
import { CommonDoc } from '@src/common/common.doc';

export const FindOneDoc = (classDto) => {
  return applyDecorators(
    CommonDoc({
      title: 'Найти запись по ее id',
      success: classDto,
      relations: true,
      params: [
        {
          name: 'id',
          required: true,
          description: 'Id номер записи',
        },
      ],
      queries: [
        {
          name: 'relations',
          description: 'Массив объектов с нужными связями',
          type: '[RelationsDto]',
          example: [{ name: 'table', order: 'id', desc: true }],
        },
      ],
    }),
  );
};
