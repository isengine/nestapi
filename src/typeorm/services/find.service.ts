export const findWhere = (dto, root) => {
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

export const findOrder = (orderField, orderType, root) => {
  const type = !orderType || (orderType && orderType.toLowerCase() !== 'desc');
  const match = orderField?.indexOf('.') < 0;
  return {
    field: match ? `${root}.${orderField}` : orderField,
    type,
  };
};

export const findSkip = (skip, limit, page) => {
  if (page) {
    skip = skip + limit * (page - 1);
  }
  return { limit, skip };
};

export const findCreate = (query, dto, findDto, root) => {
  const where = findWhere(dto, root);
  query.where(where);

  if (findDto) {
    const order = findOrder(findDto.order, findDto.type, root);
    query.orderBy(order.field, order.type ? 'ASC' : 'DESC');

    const { skip, limit, page } = findDto;
    const options = findSkip(skip, limit, page);
    if (options.skip) {
      query.skip(options.skip);
    }
    if (options.limit) {
      query.take(options.limit);
    }
  }
};
