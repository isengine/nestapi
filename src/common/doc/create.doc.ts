import { applyDecorators } from '@nestjs/common';
import { CommonDoc } from '@src/common/common.doc';

export const CreateDoc = (classDto) => {
  return applyDecorators(
    CommonDoc({
      title: 'Создать запись',
      models: [classDto],
      success: classDto,
      relations: true,
      queries: [
        {
          name: 'create',
          description:
            'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
          type: classDto.name,
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
