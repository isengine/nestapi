import { Injectable } from '@nestjs/common';
import { GrantsDto } from '@src/grants/grants.dto';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class AuthGrantsService {
  constructor(
    private readonly tokenService: TokenService,
  ) {}

  async auth(grantsDto: GrantsDto): Promise<any> {
    console.log('-- grantsTokenAuth', grantsDto);
    const { refresh_token } = grantsDto;
    const token = await this.tokenService.refresh(
      refresh_token,
      (data) => !data.client_id,
    );
    // console.log('-- request.session', request?.session);
    // if (request) {
    //   const sessionToken = request.session.token;
    //   if (!sessionToken || refresh_token !== sessionToken) {
    //     throw new UnauthorizedException('Please sign in!');
    //   }
    //   request.session.token = token;
    // }
    return await this.tokenService.prepare(token, grantsDto.state);
  }
}
