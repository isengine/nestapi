import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { ProtectedService } from '@src/common/service/protected.service';

@Injectable()
export class PostsService extends ProtectedService<
  PostsEntity,
  PostsDto,
  PostsFilter
> {
  constructor(
    @InjectRepository(PostsEntity)
    protected readonly repository: Repository<PostsEntity>,
  ) {
    super();
  }
}
