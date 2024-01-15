// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get_all')
  async postsGetAll(@Body('relations') relations: Array<string>) {
    return await this.postsService.postsGetAll(relations);
  }

  @Get('get_one')
  async postsGetOne(
    @Body('id') id: number,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.postsService.postsGetOne(id, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async postsGetMany(
    @Body('ids') ids: Array<number | string>,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.postsService.postsGetMany(ids, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async postsFilter(
    @Body('filter') postsDto: PostsDto,
    @Body('options') optionsDto: OptionsDto,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.postsService.postsFilter(
      postsDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async postsSearch(
    @Body('search') searchDto: SearchDto,
    @Body('options') optionsDto: OptionsDto,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.postsService.postsSearch(
      searchDto,
      optionsDto,
      relations,
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
