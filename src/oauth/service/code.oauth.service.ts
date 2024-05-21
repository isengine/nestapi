import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { CodeGenerateOAuthService } from '@src/oauth/service/codeGenerate.oauth.service';

@Injectable()
export class CodeOAuthService {
  constructor(
    private readonly codeGenerateOAuthService: CodeGenerateOAuthService,
  ) {}

  async code(
    clientsDto: ClientsDto,
    id: number,
    state: string,
  ): Promise<string> {
    const updated = await this.codeGenerateOAuthService.codeGenerate({ ...clientsDto }, id);
    const [{ uri }] = clientsDto.redirects;
    if (!updated) {
      throw new BadRequestException('Client oauthentication failed. Unknown client', 'invalid_client');
    }
    return `${uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }
}
