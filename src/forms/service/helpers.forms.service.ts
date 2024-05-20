import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersFormsService {
  error = {
    error: 'Bad request',
    message: 'Unknown error',
  };
  
  constructor() {}

  async back(req, data): Promise<string> {
    const { body, headers } = req;
    const { referer } = headers;

    const url = new URL(referer);
    const { protocol, host, pathname } = url;
    const ref = `${protocol}//${host}${pathname}`;

    const dataArray = [];
    for (const [key, value] of Object.entries({ ...body, ...data })) {
      dataArray.push(`${key}=${ encodeURI(`${value}`) }`);
    }

    return `${ref}?${dataArray.join('&')}`;
  }

  async redirect(req, res, data = undefined) {
    const back = await this.back(req, data || this.error);
    return await res.redirect(back);
  }

  selfUrl(req) {
    const { headers, protocol } = req;
    return `${protocol}://${headers.host}`;
  }

  async query(req, res, uri) {
    const base = this.selfUrl(req);
    return await res.redirect(`${base}${uri}`);
  }
}
