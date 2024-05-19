import { applyDecorators } from '@nestjs/common';
import { DocBaseDecorator } from '@src/common/decorator/doc/base.decorator';

export const DocManyDecorator = (classDto) => {
  return applyDecorators(
    DocBaseDecorator({
      title: 'Найти записи по нескольким id',
      success: [classDto],
      params: [
        {
          name: 'ids',
          required: true,
          description: 'Id номера записей через запятую',
          example: '1,2,3'
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
    })
  );
};
