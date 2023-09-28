import { ILike } from 'typeorm';

export const findInWhere = (findInDto) => {
  const { string, array } = findInDto;
  const where = [];
  const search = ILike(`%${string}%`);

  array.map((i) => {
    if (i.indexOf('.') < 0) {
      where.push({ [i]: search });
      return;
    }
    const item = i.split('.').reduceRight((acc, el) => ({ [el]: acc }), search);
    where.push(item);
    return;
  });

  return where;
};
