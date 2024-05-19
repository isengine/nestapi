import { applyDecorators } from '@nestjs/common';
import { DocFindDecorator } from '@src/common/decorator/doc/find.decorator';
import { DocFindOneDecorator } from '@src/common/decorator/doc/findone.decorator';
import { DocFirstDecorator } from '@src/common/decorator/doc/first.decorator';
import { DocManyDecorator } from '@src/common/decorator/doc/many.decorator';
import { DocSelfDecorator } from '@src/common/decorator/doc/self.decorator';
import { DocFilterDecorator } from '@src/common/decorator/doc/filter.decorator';
import { DocCreateDecorator } from '@src/common/decorator/doc/create.decorator';
import { DocUpdateDecorator } from '@src/common/decorator/doc/update.decorator';
import { DocRemoveDecorator } from '@src/common/decorator/doc/remove.decorator';

export const Doc = (type, classDto) => {
  if (type === 'find') {
    return applyDecorators(DocFindDecorator(classDto));
  }
  if (type === 'findOne') {
    return applyDecorators(DocFindOneDecorator(classDto));
  }
  if (type === 'first') {
    return applyDecorators(DocFirstDecorator(classDto));
  }
  if (type === 'many') {
    return applyDecorators(DocManyDecorator(classDto));
  }
  if (type === 'self') {
    return applyDecorators(DocSelfDecorator(classDto));
  }
  if (type === 'filter') {
    return applyDecorators(DocFilterDecorator(classDto));
  }
  if (type === 'create') {
    return applyDecorators(DocCreateDecorator(classDto));
  }
  if (type === 'update') {
    return applyDecorators(DocUpdateDecorator(classDto));
  }
  if (type === 'remove') {
    return applyDecorators(DocRemoveDecorator());
  }
};
