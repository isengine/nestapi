import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OneHandler {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async one(data, configKey): Promise<any> {
    const expires = this.configService.get(configKey) || '';
    const token = await this.jwtService.signAsync(
      data,
      expires ? { expiresIn: expires } : {},
    );

    const date = {};
    expires?.match(/\d+[A-Za-z]*/giu)?.forEach((i) => {
      const match = [i?.match(/\d+/giu)?.[0], i?.match(/[A-Za-z]+/giu)?.[0]];
      date[match[1] || 's'] = Number(match[0]) || 0;
    });
    const expiresIn = moment.duration(date).asSeconds();

    return { token, expiresIn };
  }
}
