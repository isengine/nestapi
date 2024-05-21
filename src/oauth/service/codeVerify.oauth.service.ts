import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';

@Injectable()
export class CodeVerifyOAuthService {
  constructor(
  ) {}

  async codeVerify(code: string, clientsDto: ClientsDto): Promise<number> {
    const decoded = await Buffer.from(code, 'base64').toString('ascii');
    const data = JSON.parse(decoded);
    const { timestamp, id, client_id, redirect_uri } = data;

    const clientIdMatched = clientsDto.client_id === client_id;
    const redirectUriMatched = clientsDto.redirect_uri === redirect_uri;
    const timestampMatched = Date.now() - 10 * 600 <= Number(timestamp);
    
    if (!clientIdMatched || !redirectUriMatched || !timestampMatched) {
      throw new BadRequestException('OAuthorization code is invalid in verify process', 'invalid_request');
    }
    return id;
  }
}
