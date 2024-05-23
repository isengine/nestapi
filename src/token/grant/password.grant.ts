import { Injectable, BadRequestException } from '@nestjs/common';
import { MethodsAuthService } from '@src/auth/service/methods.auth.service';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class PasswordGrant {
  constructor(
    private readonly methodsAuthService: MethodsAuthService,
    private readonly tokenService: TokenService,
  ) {}

  async password(grantsTokenDto: GrantsTokenDto): Promise<any> {
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
    const auth = await this.methodsAuthService.login({ username, password });
    const token = await this.tokenService.pair({ id: auth.id });
    if (!token) {
      throw new BadRequestException('User authentication failed. Unknown user', 'invalid_user');
    }
    // if (request) {
    //   await this.authSessionsService.start(auth, token, request);
    // }
    console.log('-- auth', auth);
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }
}
