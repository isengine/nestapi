// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { PostsService } from '@src/posts/posts.service';
import { PostsDto } from '@src/posts/posts.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupByDto } from '@src/typeorm/dto/groupBy.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('get_all')
  async postsGetAll() {
    return await this.postsService.postsGetAll();
  }

  @Get('get_one')
  async postsGetOne(@Body() postsDto: PostsDto) {
    const { id } = postsDto;
    const result = await this.postsService.postsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async postsGetMany(@Body() getMany: GetManyDto) {
    const result = await this.postsService.postsGetMany(getMany);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('find_in')
  async postsFindIn(@Body() findInDto: FindInDto) {
    const result = await this.postsService.postsFindIn(findInDto);
    if (!result) {
      throw new NotFoundException('Any entries not found');
    }
    return result;
  }

  @Get('find_by')
  async postsFindBy(@Body() postsDto: PostsDto) {
    const result = await this.postsService.postsFindBy(postsDto);
    if (!result) {
      throw new NotFoundException('Any entries not found');
    }
    return result;
  }

  @Get('find_last_by')
  async postsFindLastBy(@Body() postsDto: PostsDto) {
    const result = await this.postsService.postsFindLastBy(postsDto);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('group_by')
  async postsGroupBy(
    @Body() groupByDto: GroupByDto,
    @Body() postsDto: PostsDto,
  ) {
    const result = await this.postsService.postsGroupBy(
      groupByDto,
      postsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async postsCreate(@Body() postsDto: PostsDto) {
    return await this.postsService.postsCreate(postsDto);
  }

  // @Put('update')
  @Post('update')
  async postsUpdate(@Body() postsDto: PostsDto) {
    return await this.postsService.postsUpdate(postsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async postsRemove(@Body() id: number) {
    return await this.postsService.postsRemove(id);
  }
}
