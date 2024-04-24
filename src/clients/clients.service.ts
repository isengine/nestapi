import { v4 } from 'uuid';
import { genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { TokensService } from '@src/tokens/tokens.service';
import { CommonService } from '@src/common/service/common.service';

@Injectable()
export class ClientsService extends CommonService<
  ClientsEntity,
  ClientsDto,
  ClientsFilter
> {
  constructor(
    @InjectRepository(ClientsEntity)
    protected readonly repository: Repository<ClientsEntity>,
    protected readonly tokensService: TokensService,
  ) {
    super();
  }

  async register(clientsDto: ClientsDto): Promise<ClientsEntity> {
    if (clientsDto.client_password) {
      const salt = await genSalt(10);
      clientsDto.client_password = await hash(clientsDto.client_password, salt);
    }
    const client = await this.create(clientsDto);
    if (!client) {
      throw new BadRequestException('Client is unknown, not registered, or parameters are set incorrectly', { cause: new Error(), description: 'invalid_client' });
    }
    const clientSecretData = await this.tokensService.tokensGenerateOne({
      client_id: client.client_id,
    }, 'JWT_CLIENTS_EXPIRES');
    client.client_secret = clientSecretData.token;
    const updated = await this.update(client.id, client);
    return updated ? client : null;
  }

  async clientsVerify(client_id: string, client_secret: string): Promise<any> {
    let client;
    try {
      client = await this.repository.findOne({
        where: {
          client_id,
          client_secret,
        }
      });
    } catch (e) {
      // grant_type=password
      console.error('Clients verify error', e);
      throw new BadRequestException(e.message, { cause: new Error(), description: 'invalid_request' });
    }
    if (!client) {
      throw new BadRequestException('Client is unknown, not registered, or parameters are set incorrectly', { cause: new Error(), description: 'invalid_client' });
    }
    if (!client.client_id || !client.client_secret) {
      throw new BadRequestException('Client is not authorized or has the rights to this request', { cause: new Error(), description: 'unauthorized_client' });
    }
    return client?.id;
  }

  async clientsGetWhere(
    where: Object,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity[]> {
    return await this.repository.find({
      relations: relationsDto?.map(i => i.name),
      where,
    });
  }

  async create(
    clientsDto: ClientsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity> {
    if (!clientsDto.client_id) {
      clientsDto.client_id = `${v4()}`;
    }
    return await super.create(clientsDto, relationsDto);
  }
}
