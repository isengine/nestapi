import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { PostsTagsDto } from './posts_tags.dto';
import { PostsTagsEntity } from './posts_tags.entity';

@Injectable()
export class PostsTagsService extends CommonService<
  PostsTagsDto,
  PostsTagsEntity
> {
  constructor(
    @InjectRepository(PostsTagsEntity)
    protected readonly repository: Repository<PostsTagsEntity>,
  ) {
    super();
  }
}
