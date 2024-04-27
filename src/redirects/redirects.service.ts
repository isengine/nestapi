import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedirectsDto } from '@src/redirects/redirects.dto';
import { RedirectsEntity } from '@src/redirects/redirects.entity';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class RedirectsService extends CommonService<
  RedirectsEntity,
  RedirectsDto,
  null
> {
  constructor(
    @InjectRepository(RedirectsEntity)
    protected readonly repository: Repository<RedirectsEntity>,
  ) {
    super();
  }
}
