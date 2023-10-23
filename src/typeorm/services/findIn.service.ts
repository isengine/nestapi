import { ILike, Like } from 'typeorm';

const createCombination = (values) => {
  const likes = [];
  const result = [];
  const permutator = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      const curr = arr.slice();
      const next = curr.splice(i, 1);
      permutator(curr.slice(), m.concat(next));
    }
  };
  permutator(values);
  result?.forEach((i) => {
    likes.push(`%${i.join('%')}%`);
  });
  return likes;
};

const fillWhere = (values, fields) => {
  const dbtypes = ['postgres'];
  const ilike = dbtypes.indexOf(process.env.DB_TYPE) >= 0;

  const where = [];
  values.forEach((value) => {
    const search = ilike ? ILike(value) : Like(value);
    fields.map((i) => {
      if (i.indexOf('.') < 0) {
        where.push({ [i]: search });
        return;
      }
      const item = i
        .split('.')
        .reduceRight((acc, el) => ({ [el]: acc }), search);
      where.push(item);
      return;
    });
  });
  return where;
};

export const findInWhere = (findInDto) => {
  const { string, array, fields } = findInDto;
  const ilikes = [];
  if (string) {
    ilikes.push(string);
  }
  if (array && array.length) {
    ilikes.push(...array);
  }
  const variants = createCombination(ilikes);
  return fillWhere(variants, fields);
};
