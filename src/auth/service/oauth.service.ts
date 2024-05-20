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

  async oauthCodeGenerate(clientsDto: ClientsDto, id: number): Promise<ClientsEntity> {
    const data = {
      timestamp: Date.now(),
      id,
      client_id: clientsDto.client_id,
      redirect_uri: clientsDto.redirects?.[0].uri,
    };
    const code = await Buffer.from(JSON.stringify(data)).toString('base64');

    clientsDto.code = code;
    delete clientsDto.auth;
    delete clientsDto.redirects;
    return await this.clientsService.update(clientsDto.id, clientsDto, null, null);
  }

  async oauthCodeVerify(code: string, clientsDto: ClientsDto): Promise<number> {
    const decoded = await Buffer.from(code, 'base64').toString('ascii');
    const data = JSON.parse(decoded);
    const { timestamp, id, client_id, redirect_uri } = data;

    const clientIdMatched = clientsDto.client_id === client_id;
    const redirectUriMatched = clientsDto.redirect_uri === redirect_uri;
    const timestampMatched = Date.now() - 10 * 600 <= Number(timestamp);
    
    if (!clientIdMatched || !redirectUriMatched || !timestampMatched) {
      throw new BadRequestException('Authorization code is invalid in verify process', 'invalid_request');
    }
    return id;
  }

  async oauthVerify(
    oauthDto: OAuthDto,
  ): Promise<ClientsDto> {
    const { response_type } = oauthDto;
    if (['code', 'token'].indexOf(response_type) < 0) {
      throw new BadRequestException('Specified type of response_type field is not supported in this request', 'invalid_request');
    }
    const result = await this.clientsService.clientsGetWhere({
      client_id: oauthDto.client_id,
      redirects: {
        uri: oauthDto.redirect_uri,
      },
    }, [
      { name: 'auth' },
      { name: 'redirects' },
    ]);
    if (!result || !result.redirects.length) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return result;
  }

  async oauthCode(
    clientsDto: ClientsDto,
    id: number,
    state: string,
  ): Promise<string> {
    const updated = await this.oauthCodeGenerate({ ...clientsDto }, id);
    const [{ uri }] = clientsDto.redirects;
    if (!updated) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }

  async oauthToken(
    clientsDto: ClientsDto,
    id: number,
    state: string,
  ): Promise<string> {
    const [{ uri }] = clientsDto.redirects;
    delete clientsDto.auth;
    delete clientsDto.redirects;
    const token = await this.tokenService.pair({ id });
    if (!token) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${uri}?token_type=Bearer&expires_in=${token.expires_in}${state ? `&state=${state}` : ''}#access_token=${token.access_token}`;
  }
}
