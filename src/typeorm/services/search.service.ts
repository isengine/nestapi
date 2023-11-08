import { Raw } from 'typeorm';
import { SearchDto } from '@src/typeorm/dto/search.dto';

export const searchService = (searchDto: SearchDto, dto) => {
  const root = dto.name;
  const { string, array, fields } = searchDto;
  const ilikes = [];
  if (string) {
    ilikes.push(string);
  }
  if (array && array.length) {
    ilikes.push(...array);
  }
  const concat = `lower(concat(${fields
    .map((field) =>
      field.indexOf('.') < 0 ? `${root}.${field}` : `${root}__${root}_${field}`,
    )
    .join(", ' ', ")}))`;
  let where = '';
  ilikes.forEach((ilike, index) => {
    where = `${where}${
      index ? ' and ' : ''
    }${concat} ilike lower('%${ilike}%')`;
  });
  return { id: Raw(() => where) };
};
