import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { TokensService } from '@src/tokens/tokens.service';
import { AuthOauthDto } from '@src/auth/dto/auth.oauth.dto';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsEntity } from '@src/clients/clients.entity';

@Injectable()
export class AuthOauthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokensService: TokensService,
  ) {}

  async oauthCodeGenerate(clientsDto: ClientsDto): Promise<ClientsEntity> {
    const code = await Buffer.from(`${Date.now()}|${clientsDto.client_id}|${clientsDto.redirect_uri}`).toString('base64');
    clientsDto.code = code;
    return await this.clientsService.update(clientsDto.id, clientsDto);
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
    authOauthDto: AuthOauthDto,
    id: number,
  ): Promise<ClientsDto> {
    const { response_type } = authOauthDto;
    console.log(' ---- authOauthDto ', authOauthDto);
    if (['code', 'token'].indexOf(response_type) < 0) {
      throw new BadRequestException('Specified type of response_type field is not supported in this request', 'invalid_request');
    }
    const result = await this.clientsService.clientsGetWhere({
      // id,
      // auth: {
      //   id,
      // },
      client_id: authOauthDto.client_id,
      redirect_uri: authOauthDto.redirect_uri,
    }, [{ name: 'auth' }]);
    // }, [{ name: 'auth' }]);
    if (!result?.length) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return result[0];
  }

  async oauthCode(
    clientsDto: ClientsDto,
    state: string,
  ): Promise<string> {
    const updated = await this.oauthCodeGenerate(clientsDto);
    if (!updated) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${updated.redirect_uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }

  async oauthToken(
    clientsDto: ClientsDto,
    state: string,
  ): Promise<string> {
    const tokens = await this.tokensService.tokensCreatePair(clientsDto.auth);
    if (!tokens) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${clientsDto.redirect_uri}?token_type=Bearer&expires_in=${tokens.expires_in}${state ? `&state=${state}` : ''}#access_token=${tokens.access_token}`;
  }
}
