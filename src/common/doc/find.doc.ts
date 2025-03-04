import { applyDecorators } from '@nestjs/common';
import { CommonDoc } from '@src/common/common.doc';

export const FindDoc = (classDto) => {
  return applyDecorators(
    CommonDoc({
      title: 'Найти все записи',
      models: [classDto],
      success: [classDto],
      relations: true,
      queries: [
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
            'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
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
          name: 'limit',
          description: 'Число записей, которые будут получены',
          example: 0,
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
