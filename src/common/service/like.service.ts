import { ILike, Like } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const dbType = process.env.DB_TYPE;

export const prepareLike = () => {
  if (dbType === 'postgres') {
    return 'ILIKE';
  }

  return 'LIKE';
};

export const prepareLikeOrm = (value) => {
  if (dbType === 'postgres') {
    return ILike(value);
  }

  return Like(value);
};
