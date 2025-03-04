import { v4 } from 'uuid';
import { genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { TokenService } from '@src/token/token.service';
import { ClientsDto } from './clients.dto';
import { ClientsEntity } from './clients.entity';
import { ClientsRedirectsService } from './clients_redirects/clients_redirects.service';
import { BindDto } from '@src/common/dto/bind.dto';

@Injectable()
export class ClientsService extends CommonService<ClientsDto, ClientsEntity> {
  constructor(
    @InjectRepository(ClientsEntity)
    protected readonly repository: Repository<ClientsEntity>,
    protected readonly clientsRedirectsService: ClientsRedirectsService,
    protected readonly tokenService: TokenService,
  ) {
    super();
  }

  async create(
    clientsDto: ClientsDto,
    relations: Array<RelationsDto> = undefined,
    bind: BindDto,
  ): Promise<ClientsEntity> {
    if (clientsDto.client_password) {
      const salt = await genSalt(10);
      clientsDto.client_password = await hash(clientsDto.client_password, salt);
    }
    if (clientsDto.client_id) {
      const exists = await this.clientsGetWhere({
        client_id: clientsDto.client_id,
      });
      if (exists) {
        throw new BadRequestException('Client is exists', {
          cause: new Error(),
          description: 'invalid_client',
        });
      }
    }
    if (!clientsDto.client_id) {
      clientsDto.client_id = `${v4()}`;
    }
    const client = await super.create(clientsDto, relations, bind);
    if (!client) {
      throw new BadRequestException(
        'Client is unknown, not registered, or parameters are set incorrectly',
        { cause: new Error(), description: 'invalid_client' },
      );
    }
    if (clientsDto.redirect_uri) {
      await this.clientsRedirectsService.create(
        {
          client: {
            id: client.id,
          },
          uri: clientsDto.redirect_uri,
        },
        [{ name: 'client' }],
      );
    }
    const clientSecretData = await this.tokenService.one(
      {
        client_id: client.client_id,
      },
      'JWT_CLIENTS_EXPIRES',
    );
    client.client_secret = clientSecretData.token;
    const updated = await this.update(client.id, client, relations, bind);
    return updated ? client : null;
  }

  async clientsVerify(client_id: string, client_secret: string): Promise<any> {
    let client;
    try {
      client = await this.repository.findOne({
        where: {
          client_id,
          client_secret,
        },
      });
    } catch (e) {
      // grant_type=password
      console.error('Clients verify error', e);
      throw new BadRequestException(e.message, {
        cause: new Error(),
        description: 'invalid_request',
      });
    }
    if (!client) {
      throw new BadRequestException(
        'Client is unknown, not registered, or parameters are set incorrectly',
        { cause: new Error(), description: 'invalid_client' },
      );
    }
    if (!client.client_id || !client.client_secret) {
      throw new BadRequestException(
        'Client is not authorized or has the rights to this request',
        { cause: new Error(), description: 'unauthorized_client' },
      );
    }
    return client;
  }

  async clientsGetWhere(
    where: object,
    relations: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity> {
    return await this.repository.findOne({
      relations: relations?.map((i) => i.name),
      where,
    });
  }
}
