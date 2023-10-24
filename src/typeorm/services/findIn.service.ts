export const findInWhere = (findInDto, root) => {
  const { string, array, fields } = findInDto;
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
    where = `${where}${
      index ? ' and ' : ''
    }${concat} ilike lower('%${ilike}%')`;
  });
  return where;
};
