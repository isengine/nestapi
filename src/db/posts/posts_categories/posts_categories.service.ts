import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { PostsCategoriesDto } from './posts_categories.dto';
import { PostsCategoriesEntity } from './posts_categories.entity';

@Injectable()
export class PostsCategoriesService extends CommonService<
  PostsCategoriesDto,
  PostsCategoriesEntity
> {
  constructor(
    @InjectRepository(PostsCategoriesEntity)
    protected readonly repository: Repository<PostsCategoriesEntity>,
  ) {
    super();
  }
}
