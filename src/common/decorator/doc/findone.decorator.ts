import { applyDecorators } from '@nestjs/common';
import { DocBaseDecorator } from '@src/common/decorator/doc/base.decorator';

export const DocFindOneDecorator = (classDto) => {
  return applyDecorators(
    DocBaseDecorator({
      title: 'Найти запись по ее id',
      success: classDto,
      params: [
        {
          name: 'id',
          required: true,
          description: 'Id номер записи',
        }
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
