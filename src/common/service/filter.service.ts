import { isArray, isBoolean } from 'class-validator';
import { SearchDto } from '@src/common/dto/search.dto';
import * as dotenv from 'dotenv';

dotenv.config();

export const filterService = (
  dto,
  searchDto: SearchDto,
  root = '',
  core = undefined,
  fieldsMap = {},
) => {
  const where = [];
  const quotes = quotesService(core);
  if (dto) {
    filtrationService(where, dto, quotes, root, fieldsMap);
  }
  if (searchDto) {
    const searched = searchService(searchDto, quotes, root, core, fieldsMap);
    if (searched) {
      where.push(searched);
    }
  }
  return where.join(' AND ');
};

const quotesService = (core) => {
  const fromEnv = process.env.DB_QUOTES;
  const autoDetect = core === 'postgres' ? '"' : '`';
  const defaults = '"';
  return fromEnv || autoDetect || defaults;
}

const filtrationService = (where, dto, quotes, root = '', fieldsMap = {}) => {
  Object.entries(dto).map(([key, value]) => {
    if (isArray(value)) {
      const [ firstValue ] = value;
      filtrationService(where, firstValue, quotes, key, fieldsMap);
      return;
    }
    if (typeof value === 'object') {
      filtrationService(where, value, quotes, key, fieldsMap);
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

    let result = '';
    const match = `${value}`?.match(/\{.+\}/giu)?.length;
    if (match) {
      result = `${value}`.replace(/\{(.+?)\}/giu, (all, match) => match?.split('.')?.map((i) => `${quotes}${i}${quotes}`)?.join('.'));
    } else {
      result = `${key} ${value}`;
    }
    where.push(result);
  });
};

const searchService = (searchDto: SearchDto, quotes, root, core = undefined, fieldsMap = {}) => {
  const { string, array, fields, or } = searchDto;

  const where = [];
  const type = or ? ' OR ' : ' AND ';
  const ilikes = [];

  if (string) {
    ilikes.push(string);
  }
  if (array && array.length) {
    ilikes.push(...array);
  }

  const concat = `LOWER(CONCAT(${fields
    .map((field) => {
      const parentKey = `${field.indexOf('.') < 0 ? `${root}` : `${field.split('.')?.[0]}`}.`;
      const rootKey = `${field.indexOf('.') < 0 ? `${root}.` : ''}${field}`;
      const fieldsKey = `${fieldsMap[rootKey] ? `${parentKey}${fieldsMap[rootKey]}` : rootKey}`;
      return `${quotes}${fieldsKey.split('.').join(`${quotes}.${quotes}`)}${quotes}`;
    })
    .join(', \' \', ')
  }))`;

  ilikes?.forEach((ilike) => {
    const string = `${concat} ${
      core === 'postgres' ? 'ILIKE' : 'LIKE'
    } LOWER('%${ilike}%')`;
    where.push(string);
  });

  return where.join(type);
};
