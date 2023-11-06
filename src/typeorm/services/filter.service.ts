import { Raw } from 'typeorm';

export const filterService = (dto) => {
  const where = {};
  Object.entries(dto).map(([key, value]) => {
    if (typeof value === 'object') {
      const result = filterService(value);
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
