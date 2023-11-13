import * as moment from 'moment';
import { OptionsDto } from '@src/typeorm/dto/options.dto';

export const optionsCount = (data, count, optionsDto: OptionsDto) => {
  const { limit } = optionsDto;
  const pages = count && limit ? Math.ceil(count / limit) : undefined;
  return [
    {
      count,
      pages,
      value: undefined,
      list: data,
    },
  ];
};

export const optionsGroup = (data, optionsDto: OptionsDto) => {
  // return groupBy(data, (item) => item[group]);

  const { group, type } = optionsDto;
  const values = [];
  const result = [];

  data.forEach((i) => {
    const split = group.split('.');
    const len = split.length;
    let name = i;
    let n = 0;
    while (n >= 0 && n < len) {
      name = name[split[n]];
      n += 1;
    }

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

    let index = values.indexOf(name);

    if (index < 0) {
      values.push(name);
      index = values.indexOf(name);
      result.push({
        count: 0,
        list: [],
        pages: undefined,
        group: name,
      });
    }

    result[index].list.push(i);
    result[index].count += 1;
  });

  return result;
};

export const optionsOrder = (optionsDto: OptionsDto, root = '') => {
  const { order, group, desc } = optionsDto;
  const type = !desc || String(desc)?.toLowerCase() !== 'desc' ? 'ASC' : 'DESC';
  const field = order || group;
  return { field: field.indexOf('.') < 0 ? `${root}.${field}` : field, type };
};

export const optionsSkip = (optionsDto: OptionsDto) => {
  const { skip, limit, page } = optionsDto;
  const offset = page ? skip + limit * (page - 1) : skip;
  return {
    take: limit,
    skip: offset,
  };
};

export const optionsService = async (
  query,
  optionsDto: OptionsDto,
  root = '',
) => {
  if (optionsDto.order || optionsDto.group) {
    const order = optionsOrder(optionsDto, root);
    query.orderBy(order.field, order.type);
  }

  if (optionsDto.skip || optionsDto.limit) {
    const limits = optionsSkip(optionsDto);
    if (limits.skip) {
      query.skip(limits.skip);
    }
    if (limits.take) {
      query.take(limits.take);
    }
  }

  const result = await query.getMany();
  const count = optionsDto.limit ? await query.count() : result.length;

  if (optionsDto.group) {
    return optionsGroup(result, optionsDto);
  }
  return optionsCount(result, count, optionsDto);
};
