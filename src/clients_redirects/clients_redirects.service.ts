import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsRedirectsDto } from '@src/clients_redirects/clients_redirects.dto';
import { ClientsRedirectsEntity } from '@src/clients_redirects/clients_redirects.entity';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class ClientsRedirectsService extends CommonService<
  ClientsRedirectsEntity,
  ClientsRedirectsDto,
  null
> {
  constructor(
    @InjectRepository(ClientsRedirectsEntity)
    protected readonly repository: Repository<ClientsRedirectsEntity>,
  ) {
    super();
  }
}
