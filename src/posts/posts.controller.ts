// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get_all')
  async postsGetAll() {
    return await this.postsService.postsGetAll();
  }

  @Get('get_one')
  async postsGetOne(@Body('id') id: number) {
    const result = await this.postsService.postsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async postsGetMany(@Body('ids') getMany: GetManyDto) {
    const result = await this.postsService.postsGetMany(getMany);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('find')
  async postsFind(
    @Body('find') postsDto: PostsDto,
    @Body('options') findDto?: FindDto,
  ) {
    const result = await this.postsService.postsFind(postsDto, findDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('group')
  async postsGroup(
    @Body('group') groupDto: GroupDto,
    @Body('where') postsDto: PostsDto,
  ) {
    const result = await this.postsService.postsGroup(
      groupDto,
      postsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async postsSearch(@Body('search') searchDto: SearchDto) {
    const result = await this.postsService.postsSearch(searchDto);
    if (!result) {
      throw new NotFoundException('Any entries not found');
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
