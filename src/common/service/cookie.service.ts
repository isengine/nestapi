import { Request, Response } from 'express';

export class Cookie {
  constructor(private request: Request, private response: Response) {}

  set(name: string, data: string | number): void {
    this.response.cookie(name, data, {
      httpOnly: true,
      path: '/',
      secure: false,
    });
  }

  setJson(name: string, data: any): void {
    this.response.cookie(name, JSON.stringify(data), {
      httpOnly: true,
      path: '/',
      secure: false,
    });
  }

  get(name: string) {
    return this.request.cookies[name];
  }

  getJson(name: string) {
    return JSON.parse(this.request.cookies[name] || 'null');
  }

  reset(name: string): void {
    this.response.clearCookie(name);
  }
}
