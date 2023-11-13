import { SearchDto } from '@src/typeorm/dto/search.dto';

export const searchService = (searchDto: SearchDto, root, core = undefined) => {
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
    where = `${where}${index ? ' and ' : ''}${concat} ${
      core === 'postgres' ? 'ilike' : 'like'
    } lower('%${ilike}%')`;
  });
  return where;
};
