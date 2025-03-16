import { UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { hash } from '../service/crypt.service';

dotenv.config();

export function tokenValidate(token: string): boolean {
  if (!token) {
    throw new UnauthorizedException('Token is missing');
  }

  const [tokenHashed, tokenTimestamp] = token.split('.');

  const expires = Number(process.env.HIDDEN_EXPIRES);
  const string = `${process.env.HIDDEN_SECRET}.${tokenTimestamp}`;
  const method = `${process.env.HIDDEN_METHOD || 'MD5'}`.toLowerCase();
  const hashed = hash(string, method);

  if (hashed !== tokenHashed) {
    throw new UnauthorizedException('Token is invalid');
  }

  const timestamp = Date.now() / 1000;
  const expired = Number(timestamp) - Number(tokenTimestamp);

  if (expired < 0) {
    throw new UnauthorizedException('Token is fake');
  }

  if (expires && expired > expires) {
    throw new UnauthorizedException('Token is expired');
  }

  return true;
}

export function tokenValidateSimple(token: string): boolean {
  if (!token) {
    throw new UnauthorizedException('Token is missing');
  }

  const word = process.env.HIDDEN_SIMPLE;

  if (!word) {
    throw new UnauthorizedException('Token not set on server');
  }

  return token === word;
}
