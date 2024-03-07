import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/dto/clients.dto';
import { TokensService } from '@src/tokens/tokens.service';
import { AuthClientsDto } from '@src/clients/dto/auth.clients.dto';
import { ClientsService } from '@src/clients/service/clients.service';
import { ClientsEntity } from '@src/clients/clients.entity';

@Injectable()
export class AuthClientsService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly tokensService: TokensService,
  ) {}

  async clientsAuthCodeGenerate(clientsDto: ClientsDto): Promise<ClientsEntity> {
    const code = await Buffer.from(`${Date.now()}|${clientsDto.client_id}|${clientsDto.redirect_uri}`).toString('base64');
    clientsDto.code = code;
    return await this.clientsService.clientsUpdate(clientsDto);
  }

  async clientsAuthCodeVerify(code: string, clientsDto: ClientsDto): Promise<boolean> {
    const decoded = await Buffer.from(code, 'base64').toString('ascii')?.split('|');
    const [ timestamp, client_id, redirect_uri ] = decoded;
    const clientIdMatched = clientsDto.client_id === client_id;
    const redirectUriMatched = clientsDto.redirect_uri === redirect_uri;
    const timestampMatched = Date.now() - 10 * 600 <= Number(timestamp);
    return clientIdMatched && redirectUriMatched && timestampMatched;
  }

  async clientsAuthPrepare(
    authClientsDto: AuthClientsDto,
    id: number,
  ): Promise<ClientsDto> {
    const { response_type } = authClientsDto;
    if (['code', 'token'].indexOf(response_type) < 0) {
      throw new BadRequestException('Specified type of response_type field is not supported in this request', 'invalid_request');
    }
    const result = await this.clientsService.clientsGetWhere({
      id,
      client_id: authClientsDto.client_id,
      redirect_uri: authClientsDto.redirect_uri,
    }, [{ name: 'auth' }]);
    if (!result?.length) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return result[0];
  }

  async clientsAuthCode(
    clientsDto: ClientsDto,
    state: string,
  ): Promise<string> {
    const updated = await this.clientsAuthCodeGenerate(clientsDto);
    if (!updated) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${updated.redirect_uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }

  async clientsAuthToken(
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
