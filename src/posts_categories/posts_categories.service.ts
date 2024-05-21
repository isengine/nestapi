import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsCategoriesDto } from '@src/posts_categories/posts_categories.dto';
import { PostsCategoriesEntity } from '@src/posts_categories/posts_categories.entity';
import { PostsCategoriesFilter } from '@src/posts_categories/posts_categories.filter';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class PostsCategoriesService extends CommonService<
  PostsCategoriesEntity,
  PostsCategoriesDto,
  PostsCategoriesFilter
> {
  constructor(
    @InjectRepository(PostsCategoriesEntity)
    protected readonly repository: Repository<PostsCategoriesEntity>,
  ) {
    super();
  }
}
