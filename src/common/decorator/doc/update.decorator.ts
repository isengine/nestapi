import { applyDecorators } from '@nestjs/common';
import { DocBaseDecorator } from '@src/common/decorator/doc/base.decorator';

export const DocUpdateDecorator = (classDto) => {
  return applyDecorators(
    DocBaseDecorator({
      title: 'Обновить запись по ее id',
      models: [classDto],
      success: classDto,
      params: [
        {
          name: 'id',
          required: true,
          description: 'Id номер записи'
        }
      ],
      queries: [
        {
          name: 'update',
          description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
          type: classDto.name,
        },
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
