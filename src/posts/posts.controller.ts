// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';
import { Data } from '@src/app.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get_all')
  async postsGetAll(@Data('relations') relationsDto: Array<RelationsDto>) {
    return await this.postsService.postsGetAll(relationsDto);
  }

  @Get('get_one')
  async postsGetOne(
    @Data('id') id: number,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.postsService.postsGetOne(id, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async postsGetMany(
    @Data('ids') ids: Array<number | string>,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.postsService.postsGetMany(ids, relationsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async postsFilter(
    @Data('filter') postsDto: PostsDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.postsService.postsFilter(
      postsDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async postsSearch(
    @Data('search') searchDto: SearchDto,
    @Data('options') optionsDto: OptionsDto,
    @Data('relations') relationsDto: Array<RelationsDto>,
  ) {
    const result = await this.postsService.postsSearch(
      searchDto,
      optionsDto,
      relationsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async postsCreate(@Body('create') postsDto: PostsDto) {
    return await this.postsService.postsCreate(postsDto);
  }

  // @Put('update')
  @Post('update')
  async postsUpdate(@Body('update') postsDto: PostsDto) {
    return await this.postsService.postsUpdate(postsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async postsRemove(@Body('id') id: number) {
    return await this.postsService.postsRemove(id);
  }
}
