import { applyDecorators, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FindDoc } from '@src/common/doc/find.doc';
import { FindOneDoc } from '@src/common/doc/findone.doc';
import { FirstDoc } from '@src/common/doc/first.doc';
import { ManyDoc } from '@src/common/doc/many.doc';
import { SelfDoc } from '@src/common/doc/self.doc';
import { FilterDoc } from '@src/common/doc/filter.doc';
import { CreateDoc } from '@src/common/doc/create.doc';
import { UpdateDoc } from '@src/common/doc/update.doc';
import { RemoveDoc } from '@src/common/doc/remove.doc';

export const Data = createParamDecorator(
  async (arg = '', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { body, query } = request;
    const data = { ...query, ...body };
    let result = arg ? data[arg] : data;
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch (e) {
        console.log(e);
      }
    }
    return result;
  },
);

export const Doc = (type, classDto) => {
  if (type === 'find') {
    return applyDecorators(FindDoc(classDto));
  }
  if (type === 'findOne') {
    return applyDecorators(FindOneDoc(classDto));
  }
  if (type === 'first') {
    return applyDecorators(FirstDoc(classDto));
  }
  if (type === 'many') {
    return applyDecorators(ManyDoc(classDto));
  }
  if (type === 'self') {
    return applyDecorators(SelfDoc(classDto));
  }
  if (type === 'filter') {
    return applyDecorators(FilterDoc(classDto));
  }
  if (type === 'create') {
    return applyDecorators(CreateDoc(classDto));
  }
  if (type === 'update') {
    return applyDecorators(UpdateDoc(classDto));
  }
  if (type === 'remove') {
    return applyDecorators(RemoveDoc());
  }
};
