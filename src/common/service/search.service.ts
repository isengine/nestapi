import { SearchType } from '../type/search.type';

export const searchService = (result, search: SearchType) => {
  const { fields, terms, method } = search;
  const and = `${method || ''}` !== 'or';

  const text = extractValues(result, fields)?.toLowerCase();
  if (and) {
    return terms.every((term) => textIncludes(text, term));
  }
  return terms.some((term) => textIncludes(text, term));
};

const extractValues = (obj, keys) => {
  return keys
    .map((key) => {
      const path = key.split('.');
      return path.reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : null),
        obj,
      );
    })
    .filter((value) => value !== null)
    .join(' ');
};

const textIncludes = (text, term) => {
  return text.includes(term.toLowerCase());
};
