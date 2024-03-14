import { SearchDto } from '@src/common/dto/search.dto';
import * as dotenv from 'dotenv';

dotenv.config();
const quotes = process.env.DB_QUOTES || '"';

export const searchService = (searchDto: SearchDto, root, core = undefined, fieldsMap = {}) => {
  const { string, array, fields, where } = searchDto;

  let whereResult = '';
  const ilikes = [];

  if (string) {
    ilikes.push(string);
  }
  if (array && array.length) {
    ilikes.push(...array);
  }

  const concat = `lower(concat(${fields
    .map((field) => {
      const parentKey = `${field.indexOf('.') < 0 ? `${root}` : `${field.split('.')?.[0]}`}.`;
      const rootKey = `${field.indexOf('.') < 0 ? `${root}.` : ''}${field}`;
      const fieldsKey = `${fieldsMap[rootKey] ? `${parentKey}${fieldsMap[rootKey]}` : rootKey}`;
      return `${quotes}${fieldsKey.split('.').join(`${quotes}.${quotes}`)}${quotes}`;
    })
    .join(', \' \', ')
  }))`;

  ilikes?.forEach((ilike) => {
    whereResult = `${whereResult}${whereResult ? ' and ' : ''}${concat} ${
      core === 'postgres' ? 'ilike' : 'like'
    } lower('%${ilike}%')`;
  });

  if (!where) {
    return whereResult;
  }

  whereResult = searchWhereService(where, whereResult, root, fieldsMap);

  return whereResult;
};

export const searchWhereService = (where, whereResult, root = '', fieldsMap) => {
  Object.entries(where)?.forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (typeof value === 'object') {
      whereResult = searchWhereService(value, whereResult, key, fieldsMap);
      return;
    }
    
    const parentKey = `${key.indexOf('.') < 0 ? `${root}` : `${key.split('.')?.[0]}`}.`;
    const rootKey = `${key.indexOf('.') < 0 ? `${root}.` : ''}${key}`;
    const fieldsKey = `${fieldsMap[rootKey] ? `${parentKey}${fieldsMap[rootKey]}` : rootKey}`;
    key = `${quotes}${fieldsKey.split('.').join(`${quotes}.${quotes}`)}${quotes}`;

    if (typeof value === 'string') {
      value = `'${value}'`;
    }
    if (value === undefined || value === null) {
      value = ' is null';
    } else {
      value = ` = ${value}`;
    }
    whereResult = `${whereResult}${whereResult ? ' and ' : ''}${key}${value}`;
  });

  return whereResult;
}
