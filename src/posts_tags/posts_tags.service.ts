import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsTagsDto } from '@src/posts_tags/posts_tags.dto';
import { PostsTagsEntity } from '@src/posts_tags/posts_tags.entity';
import { PostsTagsFilter } from '@src/posts_tags/posts_tags.filter';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class PostsTagsService extends CommonService<
  PostsTagsEntity,
  PostsTagsDto,
  PostsTagsFilter
> {
  constructor(
    @InjectRepository(PostsTagsEntity)
    protected readonly repository: Repository<PostsTagsEntity>,
  ) {
    super();
  }
}
