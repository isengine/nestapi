import { FilterDto } from '@src/typeorm/dto/filter.dto';
import * as moment from 'moment';

export const filterCount = (data, filterDto: FilterDto) => {
  const count = data.length;
  const { limit } = filterDto;
  const pages = Math.ceil(count / limit);
  return [
    {
      count,
      pages,
      value: undefined,
      list: data,
    },
  ];
};

export const filterGroup = (data, filterDto: FilterDto) => {
  const { group, type } = filterDto;
  const valuesLibrary = [];
  const result = [];
  data.forEach((i) => {
    let value = i[group];

    if (type) {
      if (type === 'string') {
        value = `${value}`;
      } else if (type === 'number') {
        value = Number(value);
      } else if (type === 'boolean') {
        value = Boolean(value);
      } else {
        value = moment(value).format(type);
      }
    }

    let index = valuesLibrary.indexOf(value);

    if (index < 0) {
      valuesLibrary.push(value);
      index = valuesLibrary.indexOf(value);
      result.push({
        count: 0,
        list: [],
        pages: undefined,
        value,
      });
    }

    result[index].list.push(i);
    result[index].count += 1;
  });

  return result;
};

export const filterOrder = (filterDto: FilterDto, root) => {
  const { order, group, desc } = filterDto;
  const asc = !desc || String(desc)?.toLowerCase() !== 'desc';
  const field = order || group;
  const match = field?.indexOf('.') < 0;
  return {
    field: match ? `${root}.${field}` : field,
    asc,
  };
};

export const filterSkip = (filterDto: FilterDto) => {
  const { skip, limit, page } = filterDto;
  const offset = page ? skip + limit * (page - 1) : skip;
  return {
    take: limit,
    skip: offset,
  };
};

export const filterWhere = (dto, root) => {
  const where = [];
  Object.entries(dto).map(([key, value]) => {
    const matchKey = key.indexOf('.') < 0;
    key = matchKey ? `${root}.${key}` : key;

    const matchValue = ` ${value} `.match(
      / select | update | delete | join | union /giu,
    )?.length;
    const matchEx = ` ${value} `.match(
      /=|>|<| all | any | between | exists | group by | having | ilike | in | is | like | not | avg\(| count\(| max\(| min\(|sum\(/giu,
    )?.length;

    if (matchValue) {
      value = 'IS NOT NULL';
    } else if (!matchEx) {
      value = `= '${value}'`;
    }

    where.push(`${key} ${value}`);
  });
  return where.join(' and ');
};

export const filterCreate = async (query, dto, filterDto: FilterDto, root) => {
  const where = filterWhere(dto, root);
  query.where(where);

  if (filterDto.order || filterDto.group) {
    const order = filterOrder(filterDto, root);
    query.orderBy(order.field, order.asc ? 'ASC' : 'DESC');
  }

  if (filterDto.skip || filterDto.limit) {
    const limits = filterSkip(filterDto);
    if (limits.skip) {
      query.skip(limits.skip);
    }
    if (limits.take) {
      query.take(limits.take);
    }
  }

  const result = await query.getMany();

  if (filterDto.group) {
    return filterGroup(result, filterDto);
  }

  return filterCount(result, filterDto);
};
