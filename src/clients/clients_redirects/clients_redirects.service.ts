import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { ClientsRedirectsDto } from './clients_redirects.dto';
import { ClientsRedirectsEntity } from './clients_redirects.entity';

@Injectable()
export class ClientsRedirectsService extends CommonService<
  ClientsRedirectsDto,
  ClientsRedirectsEntity
> {
  constructor(
    @InjectRepository(ClientsRedirectsEntity)
    protected readonly repository: Repository<ClientsRedirectsEntity>,
  ) {
    super();
  }
}
