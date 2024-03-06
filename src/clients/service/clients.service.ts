import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcryptjs';
import { In, Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsDto } from '@src/clients/dto/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import {
  commonEntityGetParams,
  commonRelationsCreate,
} from '@src/typeorm/service/common.service';
import { filterService } from '@src/typeorm/service/filter.service';
import { optionsService } from '@src/typeorm/service/options.service';
import { searchService } from '@src/typeorm/service/search.service';
import { TokensService } from '@src/tokens/tokens.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsEntity)
    private readonly clientsRepository: Repository<ClientsEntity>,
    private readonly tokensService: TokensService,
  ) {}

  async clientsRegister(clientsDto: ClientsDto): Promise<ClientsEntity> {
    if (clientsDto.client_password) {
      const salt = await genSalt(10);
      clientsDto.client_password = await hash(clientsDto.client_password, salt);
    }
    const client = await this.clientsCreate(clientsDto);
    if (!client) {
      throw new BadRequestException('Client is unknown, not registered, or parameters are set incorrectly', { cause: new Error(), description: 'invalid_client' });
    }
    const clientSecretData = await this.tokensService.tokensGenerateOne({
      client_id: client.client_id,
    }, 'JWT_CLIENTS_EXPIRES');
    client.client_secret = clientSecretData.token;
    const updated = await this.clientsUpdate({...client});
    return updated ? client : null;
  }

  async clientsVerify(client_id: string, client_secret: string): Promise<any> {
    let client;
    try {
      client = await this.clientsRepository.findOne({
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

  async clientsGenerateCode(clientsDto: ClientsDto): Promise<ClientsEntity> {
    const code = await Buffer.from(`${clientsDto.client_id}.${Date.now()}`).toString('base64');
    clientsDto.code = code;
    return await this.clientsUpdate(clientsDto);
  }

  async clientsGetAll(
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity[]> {
    return await this.clientsRepository.find({
      relations: relationsDto?.map(i => i.name),
    });
  }

  async clientsGetOne(
    id: number,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity> {
    return await this.clientsRepository.findOne({
      relations: relationsDto?.map(i => i.name),
      where: { id },
    });
  }

  async clientsGetMany(
    ids: Array<number | string>,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity[]> {
    return await this.clientsRepository.find({
      relations: relationsDto?.map(i => i.name),
      where: { id: In(ids?.map(i => Number(i) || 0)) },
    });
  }

  async clientsGetWhere(
    where: Object,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsEntity[]> {
    return await this.clientsRepository.find({
      relations: relationsDto?.map(i => i.name),
      where,
    });
  }

  async clientsFilter(
    clientsDto: ClientsDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsFilter[]> {
    const { root, fields } = commonEntityGetParams(ClientsEntity);
    const query = this.clientsRepository.createQueryBuilder(root);
    const where = filterService(clientsDto, root, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async clientsSearch(
    searchDto: SearchDto,
    optionsDto: OptionsDto,
    relationsDto: Array<RelationsDto> = undefined,
  ): Promise<ClientsFilter[]> {
    const { root, core, fields } = commonEntityGetParams(ClientsEntity);
    const query = this.clientsRepository.createQueryBuilder(root);
    const where = searchService(searchDto, root, core, fields);
    query.where(where);
    commonRelationsCreate(query, relationsDto, root);
    return await optionsService(query, optionsDto, relationsDto, root);
  }

  async clientsCreate(clientsDto: ClientsDto): Promise<ClientsEntity> {
    delete clientsDto.createdAt;
    delete clientsDto.updatedAt;
    clientsDto.client_id = v4();
    return await this.clientsRepository.save({ ...clientsDto });
  }

  async clientsUpdate(clientsDto: ClientsDto): Promise<ClientsEntity> {
    const { id } = clientsDto;
    if (id === undefined) {
      return;
    }
    delete clientsDto.createdAt;
    delete clientsDto.updatedAt;
    delete clientsDto.client_id;
    // return await this.clientsRepository.save({ ...clientsDto });
    await this.clientsRepository.save({ ...clientsDto });
    return this.clientsGetOne(id);
  }

  async clientsRemove(id: number): Promise<boolean> {
    const result = await this.clientsRepository.delete({ id });
    return !!result?.affected;
  }
}
