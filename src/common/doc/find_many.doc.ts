import { applyDecorators } from '@nestjs/common';
import { CommonDoc } from '@src/common/common.doc';

export const FindManyDoc = (classDto) => {
  return applyDecorators(
    CommonDoc({
      title: 'Найти записи по нескольким id',
      success: [classDto],
      relations: true,
      params: [
        {
          name: 'ids',
          required: true,
          description: 'Id номера записей через запятую',
          example: '1,2,3',
        },
      ],
      queries: [
        {
          name: 'select',
          description:
            'Объект выборкой полей, которые будут возвращаться, если не нужны все поля',
          type: classDto.name,
          example: { id: true },
        },
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
