import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello(): string {
    return JSON.stringify({
      error: 'No request',
    });
  }
}
