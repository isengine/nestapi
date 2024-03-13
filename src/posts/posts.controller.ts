import { Controller, Get } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { Data } from '@src/app.decorator';
import { FromClient } from '@src/auth/auth.decorator';
import { CreateController } from '@src/typeorm/create/create.controller';
import { PostsEntity } from './posts.entity';
import { PostsFilter } from './posts.filter';

@Controller('posts')
export class PostsController extends CreateController<
  PostsService,
  PostsEntity,
  PostsDto,
  PostsFilter
> {
  constructor(
    protected readonly service: PostsService,
  ) {
    super();
  }

  @FromClient()
  @Get('get_all_secure')
  async postsGetAllSecure(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.service.findAll(relationsDto);
  }
}
