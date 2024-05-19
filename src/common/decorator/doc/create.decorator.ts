import { applyDecorators } from '@nestjs/common';
import { DocBaseDecorator } from '@src/common/decorator/doc/base.decorator';

export const DocCreateDecorator = (classDto) => {
  return applyDecorators(
    DocBaseDecorator({
      title: 'Создать запись',
      models: [classDto],
      success: classDto,
      queries: [
        {
          name: 'create',
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
