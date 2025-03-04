import { prepareLike } from './like.service';
import { prepareQuotes } from './quotes.service';

export const parseDynamicWhereObject = (where) => {
  const parsed = [];
  if (!where) {
    return parsed;
  }

  const quotes = prepareQuotes();

  Object.entries(where)?.forEach(([key, value]) => {
    const [property, ...modifiers] = key.split('.');
    const propertyName = `${quotes}${property}${quotes}`;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return;
    }

    if (modifiers[0] === 'and' || modifiers[0] === 'or') {
      if (!Array.isArray(value)) {
        return;
      }

      const tempProperty = prepareAndOrValues(propertyName, value, modifiers);
      parsed.push(tempProperty);
      return;
    }

    const tempProperty = prepareDynamicWhereValue(
      propertyName,
      value,
      modifiers,
    );
    parsed.push(tempProperty);
  });
  return parsed;
};

const prepareAndOrValues = (property, values, modifiers) => {
  const properties = [];

  values.forEach((value) => {
    const [_, ...otherModifiers] = modifiers;
    const tempProperty = prepareDynamicWhereValue(
      property,
      value,
      otherModifiers,
    );
    properties.push(tempProperty);
  });

  return `(${properties.map((v) => `(${v})`).join(` ${modifiers[0]} `)})`;
};

const prepareDynamicWhereValue = (property, value, modifiers) => {
  if (Array.isArray(value) && value.length > 0) {
    value = value.map((v) => prepareDynamicValue(v)).join(',');
    value = `(${value})`;
  }

  const like = prepareLike();

  let ifNot = '';
  let modifier = modifiers[0];
  let sign = '=';

  if (modifiers[0] === 'not') {
    ifNot = ' NOT';
    modifier = modifiers[1];
    sign = '!=';
  }

  if (value === null) {
    modifier = 'null';
  }

  let result;
  switch (modifier) {
    case 'any':
      result = `${property}${ifNot} ANY ${value}`;
      break;
    case 'between':
      result = `${property}${ifNot} BETWEEN ${value}`;
      break;
    case 'boolean':
      result = `${property} ${sign} ${+value ? 'TRUE' : 'FALSE'}`;
      break;
    case 'empty':
      result = `${property} IS${ifNot} NULL AND ${property} ${sign} ''`;
      break;
    case 'in':
      result = `${property}${ifNot} IN ${value}`;
      break;
    case 'less':
      sign = '<';
      if (ifNot) {
        sign = '>=';
      }
      result = `${property} ${sign} ${parseFloat(value)}`;
      break;
    case 'lessOrEqual':
      sign = '<=';
      if (ifNot) {
        sign = '>';
      }
      result = `${property} ${sign} ${parseFloat(value)}`;
      break;
    case 'like':
      result = `${property}${ifNot} ${like} '${value}'`;
      break;
    case 'more':
      sign = '>';
      if (ifNot) {
        sign = '<=';
      }
      result = `${property} ${sign} ${parseFloat(value)}`;
      break;
    case 'moreOrEqual':
      sign = '>=';
      if (ifNot) {
        sign = '<';
      }
      result = `${property} ${sign} ${parseFloat(value)}`;
      break;
    case 'null':
      result = `${property} IS${ifNot} NULL`;
      break;
    case 'number':
      value = parseFloat(value);
      result = `${property} ${sign} ${value}`;
      break;
    case 'search':
      result = `${value || ''}`
        .toLowerCase()
        .replace(/[^0-9a-zа-я ]/giu, ' ')
        .split(' ')
        .filter(Boolean)
        .map((i) => `(${property}${ifNot} ${like} '%${i}%')`)
        .join(' AND ');
      break;
    case 'string':
      value = `'${value}'`;
      result = `${property} ${sign} ${value}`;
      break;
    default:
      value = prepareDynamicValue(value);
      result = `${property} ${sign} ${value}`;
  }

  return result;
};

const prepareDynamicValue = (value) => {
  if (value === undefined || value === '') {
    return "''";
  }
  if (value === null) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};
