import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@src/common/common.service';
import { PostsDto } from './posts.dto';
import { PostsEntity } from './posts.entity';

@Injectable()
export class PostsService extends CommonService<PostsDto, PostsEntity> {
  constructor(
    @InjectRepository(PostsEntity)
    protected readonly repository: Repository<PostsEntity>,
  ) {
    super();
  }
}
