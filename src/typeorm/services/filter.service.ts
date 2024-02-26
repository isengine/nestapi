import { isArray, isBoolean } from 'class-validator';
import * as dotenv from 'dotenv';

dotenv.config();
const quotes = process.env.DB_QUOTES || '"';

export const filterService = (dto, root = '', fieldsMap = {}) => {
  let where = '';
  Object.entries(dto).map(([key, value], index) => {
    if (index) {
      where += ' AND ';
    }
    if (isArray(value)) {
      const [ firstValue ] = value;
      const result = filterService(firstValue, key, fieldsMap);
      where += result;
      return;
    }
    if (typeof value === 'object') {
      const result = filterService(value, key, fieldsMap);
      where += result;
      return;
    }
    const rootKey = `${root ? `${root}.` : ''}${key}`;
    const fieldsKey = `${fieldsMap[rootKey] ? fieldsMap[rootKey] : key}`;
    key = `${quotes}${root}${quotes}.${quotes}${fieldsKey}${quotes}`;
    const matchValue = ` ${value} `.match(
      / select | update | delete | join | union /giu,
    )?.length;
    const matchEx = ` ${value} `.match(
      /=|>|<| all | any | between | exists | group by | having | ilike | in | is | like | not | avg\(| count\(| max\(| min\(|sum\(/giu,
    )?.length;
    if (matchValue) {
      value = 'IS NOT NULL';
    } else if (!matchEx) {
      value = `= ${isBoolean(value) ? `${value}` : `'${value}'`}`;
    }
    value = String(value)?.replace(/\{alias\}/giu, key);
    where += `${key} ${value}`;
  });
  return where;
};
