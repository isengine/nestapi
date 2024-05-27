import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenAuthDto } from '@src/auth/dto/open.auth.dto';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/clients.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class OpenAuthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokenService: TokenService,
  ) {}

  async code(
    clientsDto: ClientsDto,
    id: number,
    state: string,
  ): Promise<string> {
    const updated = await this.codeGenerate({ ...clientsDto }, id);
    const [{ uri }] = clientsDto.redirects;
    if (!updated) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }

  async token(
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

  async verify(
    openAuthDto: OpenAuthDto,
  ): Promise<ClientsDto> {
    const { client_id, redirect_uri, response_type } = openAuthDto;
    console.log('-- verify');
    console.log('-- client_id', client_id);
    console.log('-- redirect_uri', redirect_uri);
    console.log('-- response_type', response_type);
    if (['code', 'token'].indexOf(response_type) < 0) {
      throw new BadRequestException('Specified type of response_type field is not supported in this request', 'invalid_request');
    }
    const result = await this.clientsService.clientsGetWhere({
      client_id,
      redirects: {
        uri: redirect_uri,
      },
    }, [
      { name: 'auth' },
      { name: 'redirects' },
    ]);
    console.log('-- result', result);
    if (!result || !result.redirects.length) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return result;
  }

  async codeGenerate(clientsDto: ClientsDto, id: number): Promise<ClientsEntity> {
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

  async codeVerify(code: string, clientsDto: ClientsDto): Promise<number> {
    console.log('-- codeVerify...');
    const decoded = await Buffer.from(code, 'base64').toString('ascii');
    console.log('-- decoded', decoded);
    const data = JSON.parse(decoded);
    console.log('-- data', data);
    const { timestamp, id, client_id, redirect_uri } = data;
    
    const clientIdMatched = clientsDto.client_id === client_id;
    const redirectUriMatched = clientsDto.redirect_uri === redirect_uri;
    const timestampMatched = Date.now() - 10 * 600 <= Number(timestamp);
    console.log('-- clientIdMatched', clientIdMatched);
    console.log('-- redirectUriMatched', redirectUriMatched);
    console.log('-- timestampMatched...');
    console.log('-- Date.now()', Date.now());
    console.log('-- Date.now() - 10 * 600', Date.now() - 10 * 600);
    console.log('-- Number(timestamp)', Number(timestamp));
    console.log('-- timestampMatched', timestampMatched);
    console.log('-- // timestampMatched');
    
    if (!clientIdMatched || !redirectUriMatched || !timestampMatched) {
      throw new BadRequestException('Authorization code is invalid in verify process', 'invalid_request');
    }
    return id;
  }
}
