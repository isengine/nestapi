import {
  And,
  Any,
  Between,
  Equal,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Or,
} from 'typeorm';
import { prepareLikeOrm } from './like.service';

export const parseWhereObject = (where) => {
  const parsed = {};
  if (!where) {
    return parsed;
  }
  Object.entries(where)?.forEach(([key, value]) => {
    const [property, ...modifiers] = key.split('.');

    if (modifiers[0] === 'and' || modifiers[0] === 'or') {
      if (!Array.isArray(value)) {
        return;
      }

      parsed[property] = prepareAndOrValues(value, modifiers);
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      parsed[property] = parseWhereObject(value);
      return;
    }

    let tempProperty = value;
    modifiers?.reverse()?.forEach((modifier) => {
      tempProperty = prepareWhereValue(tempProperty, modifier);
    });
    parsed[property] = tempProperty;
  });
  return parsed;
};

const prepareAndOrValues = (values, modifiers) => {
  const properties = [];
  values.forEach((value) => {
    let tempProperty = value;
    const [_, ...otherModifiers] = modifiers;
    otherModifiers?.reverse()?.forEach((modifier) => {
      tempProperty = prepareWhereValue(tempProperty, modifier);
    });
    properties.push(tempProperty);
  });
  if (modifiers[0] === 'and') {
    return And(...properties);
  }
  if (modifiers[0] === 'or') {
    return Or(...properties);
  }
};

const prepareWhereValue = (value, modifier) => {
  let property;
  switch (modifier) {
    case 'any':
      if (Array.isArray(value) && value.length > 0) {
        property = Any(value);
      } else {
        throw new Error(
          `'any' modifier expects an array with more than 1 elements for property '${property}'`,
        );
      }
      break;
    case 'between':
      if (Array.isArray(value) && value.length > 1) {
        property = Between(value[0], value[1]);
      } else {
        throw new Error(
          `'between' modifier expects an array with 2 elements for property '${property}'`,
        );
      }
      break;
    case 'boolean':
      const stringValue = `${value}`.trim().toLowerCase();
      if (stringValue === 'true') {
        property = true;
        break;
      }
      if (stringValue === 'false') {
        property = false;
        break;
      }
      property = Boolean(+value);
      break;
    case 'empty':
      property = Or(IsNull(), Equal(''));
      break;
    case 'in':
      if (Array.isArray(value) && value.length > 0) {
        property = In(value);
      } else {
        throw new Error(
          `'in' modifier expects an array with more than 1 elements for property '${property}'`,
        );
      }
      break;
    case 'less':
      property = LessThan(value);
      break;
    case 'lessOrEqual':
      property = LessThanOrEqual(value);
      break;
    case 'like':
      property = prepareLikeOrm(value);
      break;
    case 'more':
      property = MoreThan(value);
      break;
    case 'moreOrEqual':
      property = MoreThanOrEqual(value);
      break;
    case 'not':
      property = Not(value);
      break;
    case 'null':
      property = IsNull();
      break;
    case 'number':
      property = parseFloat(value);
      break;
    case 'search':
      const valuesMap = `${value || ''}`
        .toLowerCase()
        .replace(/[^0-9a-zа-я ]/giu, ' ')
        .split(' ')
        .filter(Boolean)
        .map((i) => prepareLikeOrm(`%${i}%`));
      if (!valuesMap.length) {
        break;
      }
      property = And(...valuesMap);
      break;
    case 'string':
      property = `${value}`;
      break;
    default:
      property = value;
  }
  return property;
};
