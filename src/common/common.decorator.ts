import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FindDoc } from '@src/common/doc/find.doc';
import { FindOneDoc } from '@src/common/doc/find_one.doc';
import { FindFirstDoc } from '@src/common/doc/find_first.doc';
import { FindManyDoc } from '@src/common/doc/find_many.doc';
import { SelfDoc } from '@src/common/doc/self.doc';
import { CountDoc } from '@src/common/doc/count.doc';
import { CreateDoc } from '@src/common/doc/create.doc';
import { UpdateDoc } from '@src/common/doc/update.doc';
import { RemoveDoc } from '@src/common/doc/remove.doc';
import { SortPositionDoc } from '@src/common/doc/position_sort.doc';
import { MovePositionDoc } from '@src/common/doc/position_move.doc';

export const Data = createParamDecorator(
  async (arg = '', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { body, query } = request;
    const data = { ...query, ...body };
    let result = arg ? data[arg] : data;
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch {}
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
  if (type === 'findFirst') {
    return applyDecorators(FindFirstDoc(classDto));
  }
  if (type === 'findMany') {
    return applyDecorators(FindManyDoc(classDto));
  }
  if (type === 'self') {
    return applyDecorators(SelfDoc(classDto));
  }
  if (type === 'count') {
    return applyDecorators(CountDoc(classDto));
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
  if (type === 'sortPosition') {
    return applyDecorators(SortPositionDoc(classDto));
  }
  if (type === 'movePosition') {
    return applyDecorators(MovePositionDoc());
  }
};
