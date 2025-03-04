import * as dotenv from 'dotenv';

dotenv.config();

export const prepareParams = (object) => {
  const dbType = process.env.DB_TYPE;

  const result = {};
  Object.keys(object).forEach((key, index) => {
    let symbol = '?';
    if (dbType === 'postgres') {
      symbol = `\$${index + 1}`;
    }
    result[key] = symbol;
  });
  return result;
};
