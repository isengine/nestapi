import { Injectable } from '@nestjs/common';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsService } from '@src/clients/clients.service';
import { ClientsEntity } from '@src/clients/clients.entity';

@Injectable()
export class CodeGenerateOAuthService {
  constructor(
    private readonly clientsService: ClientsService,
  ) {}

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
}
