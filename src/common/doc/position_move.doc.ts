import { applyDecorators } from '@nestjs/common';
import { CommonDoc } from '@src/common/common.doc';

export const MovePositionDoc = () => {
  return applyDecorators(
    CommonDoc({
      title: 'Перемещение записи на новое место',
      success: Boolean,
      params: [
        {
          name: 'id',
          required: true,
          description: 'Id номер записи',
        },
      ],
      queries: [
        {
          name: 'field',
          description: 'Числовое поле для сортировки записей',
          type: 'string',
          example: 'position',
        },
        {
          name: 'position',
          description: 'Номер новой позиции',
          type: 'string',
          example: '5',
        },
      ],
    }),
  );
};
