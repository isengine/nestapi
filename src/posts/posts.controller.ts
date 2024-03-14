import { Controller, Get } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { Data } from '@src/app.decorator';
import { FromClient } from '@src/auth/auth.decorator';
import { CommonController } from '@src/common/common.controller';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';

@Controller('posts')
export class PostsController extends CommonController<
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
