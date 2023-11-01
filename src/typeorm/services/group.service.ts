import { GroupDto } from '@src/typeorm/dto/group.dto';
import * as moment from 'moment';

export const groupService = async (
  result,
  groupDto: GroupDto,
): Promise<any> => {
  const { field, type } = groupDto;
  const listNames = [];
  const list = [];
  await result.forEach(async (i) => {
    let name = i[field];

    if (type) {
      if (type === 'string') {
        name = `${name}`;
      } else if (type === 'number') {
        name = Number(name);
      } else if (type === 'boolean') {
        name = Boolean(name);
      } else {
        name = moment(name).format(type);
      }
    }

    let index = listNames.indexOf(name);

    if (index < 0) {
      listNames.push(name);
      index = listNames.indexOf(name);
      list.push({
        name,
        children: [],
      });
    }
    list[index].children.push(i);
  });

  return list;
};
