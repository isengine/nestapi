import { applyDecorators } from '@nestjs/common';
import { DocBaseDecorator } from '@src/common/decorator/doc/base.decorator';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { OptionsDto } from '@src/common/dto/options.dto';
import { SearchDto } from '@src/common/dto/search.dto';

export const DocFilterDecorator = (classDto) => {
  return applyDecorators(
    DocBaseDecorator({
      title: 'Отфильтровать записи, которые имеют совпадения и соответствуют заданным условиям',
      models: [classDto, SearchDto, OptionsDto, RelationsDto],
      success: [classDto],
      // success: [
      //   count: 0,
      //   pages: 0,
      //   group: 'string',
      //   list: [
      //     classDto,
      //   ],
      // ],
      queries: [
        {
          name: 'where',
          description: 'Объект с нужными полями записей и их значениями, по которым записи будут фильтроваться',
          type: classDto.name,
        },
        {
          name: 'search',
          description: 'Объект с полями и текстом, согласно которым будет вестись поиск',
          type: 'SearchDto',
        },
        {
          name: 'options',
          description: 'В опциях вы можете задать лимиты и группировку',
          type: 'OptionsDto',
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
