import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class PasswordGrant {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async password(
    grantsTokenDto: GrantsTokenDto,
    request,
    response,
  ): Promise<any> {
    console.log('-- password', grantsTokenDto);
    if (grantsTokenDto.grant_type !== 'password') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (
      !grantsTokenDto.username
      || !grantsTokenDto.password
    ) {
      throw new BadRequestException('Not specified username or password in this request', 'invalid_grant');
    }
    const { username, password } = grantsTokenDto;
    const auth = await this.authService.login({ username, password });
    const token = await this.tokenService.pair({ id: auth.id });
    if (!token) {
      throw new BadRequestException('User authentication failed. Unknown user', 'invalid_user');
    }
    // if (request) {
    //   await this.authSessionsService.start(auth, request);
    // }
    if (response) {
      await this.setCookie(auth.id, response);
    }
    console.log('-- auth', auth);
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }

  async setCookie(id: number, response): Promise<void> {
    response.cookie(
      'id',
      id,
      {
        httpOnly: true,
        secure: false,
      },
    );
    // localStorage.setItem('jwt', access_token);
  }
}
