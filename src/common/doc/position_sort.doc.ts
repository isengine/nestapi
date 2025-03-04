import { applyDecorators } from '@nestjs/common';
import { CommonDoc } from '@src/common/common.doc';

export const SortPositionDoc = (classDto) => {
  return applyDecorators(
    CommonDoc({
      title: 'Сортировка записей по порядку',
      models: [classDto],
      success: Boolean,
      queries: [
        {
          name: 'field',
          description: 'Числовое поле для сортировки записей',
          type: 'string',
          example: 'position',
        },
        {
          name: 'select',
          description:
            'Объект выборкой полей, которые будут возвращаться, если не нужны все поля',
          type: classDto.name,
          example: { id: true },
        },
        {
          name: 'where',
          description:
            'Объект с нужными полями записи и их значениями, по которым запись будет выбираться',
          type: classDto.name,
          example: { id: 1 },
        },
        {
          name: 'order',
          description:
            'Объект с полями записи и значением ASC/DESC, для сортировки записей по этим полям',
          example: { id: 'DESC' },
        },
        {
          name: 'offset',
          description: 'Число записей, которые будут пропущены',
          example: 0,
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
