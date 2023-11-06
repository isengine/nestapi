import * as moment from 'moment';
import { Raw } from 'typeorm';
import { FilterDto } from '@src/typeorm/dto/filter.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

export const filterCount = (data, count, filterDto: FilterDto) => {
  const { limit } = filterDto;
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

export const filterGroup = (data, filterDto: FilterDto) => {
  // return groupBy(data, (item) => item[group]);

  const { group, type } = filterDto;
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

export const filterOrder = (filterDto: FilterDto) => {
  const { order, group, desc } = filterDto;
  const asc = !desc || String(desc)?.toLowerCase() !== 'desc';
  const field = order || group;
  return {
    [field]: asc,
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

export const filterCreate = async (
  repository,
  filterDto: FilterDto,
  options,
) => {
  if (filterDto.order || filterDto.group) {
    options.order = filterOrder(filterDto);
  }

  if (filterDto.skip || filterDto.limit) {
    const limits = filterSkip(filterDto);
    if (limits.skip) {
      options.skip = limits.skip;
    }
    if (limits.take) {
      options.take = limits.take;
    }
  }

  const result = await repository.find(options);
  const count = filterDto.limit
    ? await repository.count(options)
    : result.length;

  if (filterDto.group) {
    return filterGroup(result, filterDto);
  }
  return filterCount(result, count, filterDto);
};

export const filterWhere = (dto) => {
  const where = {};
  Object.entries(dto).map(([key, value]) => {
    if (typeof value === 'object') {
      const result = filterWhere(value);
      where[key] = result;
    } else {
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
      where[key] = Raw((alias) => `${alias} ${value}`);
    }
  });
  return where;
};

export const filterSearch = (searchDto: SearchDto, dto) => {
  const root = dto.name;
  const { string, array, fields } = searchDto;
  const ilikes = [];
  if (string) {
    ilikes.push(string);
  }
  if (array && array.length) {
    ilikes.push(...array);
  }
  const concat = `lower(concat(${fields
    .map((field) => (field.indexOf('.') < 0 ? `${root}.${field}` : field))
    .join(", ' ', ")}))`;
  let where = '';
  ilikes.forEach((ilike, index) => {
    where = `${where}${
      index ? ' and ' : ''
    }${concat} ilike lower('%${ilike}%')`;
  });
  return { id: Raw(() => `${where}`) };
};
