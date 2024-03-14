import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
import { CommonService } from '@src/common/service/common.service';

@Injectable()
export class TagsService extends CommonService<
  TagsEntity,
  TagsDto,
  TagsFilter
> {
  constructor(
    @InjectRepository(TagsEntity)
    protected readonly repository: Repository<TagsEntity>,
  ) {
    super();
  }
}
