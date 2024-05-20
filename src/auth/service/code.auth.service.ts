import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { CodeGenerateAuthService } from '@src/auth/service/codeGenerate.auth.service';

@Injectable()
export class CodeAuthService {
  constructor(
    private readonly codeGenerateAuthService: CodeGenerateAuthService,
  ) {}

  async code(
    clientsDto: ClientsDto,
    id: number,
    state: string,
  ): Promise<string> {
    const updated = await this.codeGenerateAuthService.codeGenerate({ ...clientsDto }, id);
    const [{ uri }] = clientsDto.redirects;
    if (!updated) {
      throw new BadRequestException('Client authentication failed. Unknown client', 'invalid_client');
    }
    return `${uri}?code=${updated.code}&client_id=${updated.client_id}${state ? `&state=${state}` : ''}`;
  }
}
