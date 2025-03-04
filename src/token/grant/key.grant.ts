import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { TokenService } from '@src/token/token.service';
import { Cookie } from '@src/common/service/cookie.service';
import { UsersService } from '@src/db/users/users.service';

// мы делаем жесткое привязывание к сущности обучаемых только для того,
// чтобы работала обратная совместимость с беспарольным доступом

@Injectable()
export class KeyGrant {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  async key(grantsTokenDto: GrantsTokenDto, request, response): Promise<any> {
    if (grantsTokenDto.grant_type !== 'key') {
      throw new BadRequestException(
        'Specified type of grant_type field is not supported in this request',
        'unsupported_grant_type',
      );
    }
    if (!grantsTokenDto.key) {
      throw new BadRequestException(
        'Not specified key in this request',
        'invalid_grant',
      );
    }
    const { key } = grantsTokenDto;
    const user = await this.usersService.findByHash(key);
    if (!user) {
      throw new BadRequestException(
        'User authentication failed. Unknown user',
        'invalid_user',
      );
    }

    let auth = await this.authService.findByUsername(user.email);
    if (!auth) {
      auth = await this.authService.create({ username: user.email });
      if (!auth) {
        throw new BadRequestException(
          'User authentication failed. Unknown account',
          'invalid_user',
        );
      }
    }

    if (!user?.['auth_id']) {
      await this.usersService.linkToAuth(user.id, auth.id);
    }

    const token = await this.tokenService.pair({ id: auth.id, key: true });
    if (!token) {
      throw new BadRequestException(
        'User authentication failed. Unknown user',
        'invalid_user',
      );
    }
    // if (request) {
    //   await this.authSessionsService.start(auth, request);
    // }
    if (response) {
      const cookie = new Cookie(request, response);
      cookie.set('id', auth.id);
    }
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }
}
