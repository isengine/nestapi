import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { TokenService } from '@src/token/token.service';
import { OAuthDto } from '@src/auth/dto/oauth.dto';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsEntity } from '@src/clients/clients.entity';

@Injectable()
export class OAuthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async oauthCodeGenerate(clientsDto: ClientsDto): Promise<ClientsEntity> {
    const code = await Buffer.from(`${Date.now()}|${clientsDto.client_id}|${clientsDto.redirect_uri}`).toString('base64');
    clientsDto.code = code;
    return await this.clientsService.update(clientsDto.id, clientsDto, null, null);
  }

  async oauthCodeVerify(code: string, clientsDto: ClientsDto): Promise<boolean> {
    const decoded = await Buffer.from(code, 'base64').toString('ascii')?.split('|');
    const [ timestamp, client_id, redirect_uri ] = decoded;
    const clientIdMatched = clientsDto.client_id === client_id;
    const redirectUriMatched = clientsDto.redirect_uri === redirect_uri;
    const timestampMatched = Date.now() - 10 * 600 <= Number(timestamp);
    return clientIdMatched && redirectUriMatched && timestampMatched;
  }

  async oauthPrepare(
    oauthDto: OAuthDto,
    id: number,
  ): Promise<ClientsDto> {
    const { response_type } = oauthDto;
    console.log(' ---- oauthDto ', oauthDto);
    if (['code', 'token'].indexOf(response_type) < 0) {
      throw new BadRequestException('Specified type of response_type field is not supported in this request', 'invalid_request');
    }
    const result = await this.clientsService.clientsGetWhere({
      // id,
      // auth: {
      //   id,
      // },
      client_id: oauthDto.client_id,
      redirect_uri: oauthDto.redirect_uri,
    }, [
      { name: 'auth' },
      { name: 'redirects' },
    ]);
    if (!result) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return result;
  }

  async oauthCode(
    clientsDto: ClientsDto,
    state: string,
  ): Promise<string> {
    const updated = await this.oauthCodeGenerate(clientsDto);
    if (!updated) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${clientsDto.redirect_uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }

  async oauthToken(
    clientsDto: ClientsDto,
    state: string,
  ): Promise<string> {
    const token = await this.tokenService.tokenCreatePair({ id: clientsDto.auth.id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${clientsDto.redirect_uri}?token_type=Bearer&expires_in=${token.expires_in}${state ? `&state=${state}` : ''}#access_token=${token.access_token}`;
  }
}
