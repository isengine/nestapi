import { SearchDto } from '@src/typeorm/dto/search.dto';
import * as dotenv from 'dotenv';

dotenv.config();
const quotes = process.env.DB_QUOTES || '"';
console.log('---', quotes)

export const searchService = (searchDto: SearchDto, root, core = undefined) => {
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
    .map((field) => `${quotes}${`${field.indexOf('.') < 0 ? `${root}.` : ''}${field}`.split('.').join(`${quotes}.${quotes}`)}${quotes}`)
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

  whereResult = searchWhereService(where, whereResult, root);

  return whereResult;
};

export const searchWhereService = (where, whereResult, root = '') => {
  Object.entries(where)?.forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (typeof value === 'object') {
      whereResult = searchWhereService(value, whereResult, key);
      return;
    }
    
    key = `${quotes}${`${key.indexOf('.') < 0 ? `${root}.` : ''}${key}`.split('.').join(`${quotes}.${quotes}`)}${quotes}`;

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
