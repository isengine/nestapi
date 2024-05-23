import { Injectable, BadRequestException } from '@nestjs/common';
import { GrantsTokenDto } from '@src/token/dto/grants.token.dto';
import { ClientsService } from '@src/clients/clients.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class RefreshTokenGrant {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async refreshToken(grantsTokenDto: GrantsTokenDto): Promise<any> {
    if (grantsTokenDto.grant_type !== 'refresh_token') {
      throw new BadRequestException('Specified type of grant_type field is not supported in this request', 'unsupported_grant_type');
    }
    if (!grantsTokenDto.refresh_token) {
      throw new BadRequestException('Not specified refresh token in this request', 'invalid_grant');
    }
    if (grantsTokenDto.client_id || grantsTokenDto.client_secret) {
      return await this.client(grantsTokenDto);
    }
    return await this.auth(grantsTokenDto);
  }

  async auth(grantsTokenDto: GrantsTokenDto): Promise<any> {
    console.log('-- grantsTokenAuth', grantsTokenDto);
    const { refresh_token } = grantsTokenDto;
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
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }

  async client(grantsTokenDto: GrantsTokenDto): Promise<any> {
    const { refresh_token, client_id, client_secret } = grantsTokenDto;
    const client = await this.clientsService.clientsGetWhere({
      client_id,
      client_secret,
    });
    if (!client || !client_id || !client_secret) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    const token = await this.tokenService.refresh(
      refresh_token,
      (data) => data.client_id === client_id,
    );
    return await this.tokenService.prepare(token, grantsTokenDto.state);
  }
}
