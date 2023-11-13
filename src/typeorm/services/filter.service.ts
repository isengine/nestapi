export const filterService = (dto, root = '') => {
  let where = '';
  Object.entries(dto).map(([key, value], index) => {
    if (index) {
      where += ' AND ';
    }
    if (typeof value === 'object') {
      const result = filterService(value, key);
      where += result;
      return;
    }
    key = `${root}.${key}`;
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
    value = String(value)?.replace(/\{alias\}/giu, key);
    where += `${key} ${value}`;
  });
  return where;
};
