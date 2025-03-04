export type SearchType = {
  fields: string[];
  terms: string[];
  method: 'and' | 'or' | undefined;
};
