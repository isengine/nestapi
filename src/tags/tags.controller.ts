// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('get_all')
  async tagsGetAll() {
    return await this.tagsService.tagsGetAll();
  }

  @Get('get_one')
  async tagsGetOne(@Body('id') id: number) {
    const result = await this.tagsService.tagsGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async tagsGetMany(@Body('ids') getMany: GetManyDto) {
    const result = await this.tagsService.tagsGetMany(getMany);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('find')
  async tagsFind(
    @Body('find') tagsDto: TagsDto,
    @Body('options') findDto?: FindDto,
  ) {
    const result = await this.tagsService.tagsFind(tagsDto, findDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('group')
  async tagsGroup(
    @Body('group') groupDto: GroupDto,
    @Body('where') tagsDto: TagsDto,
  ) {
    const result = await this.tagsService.tagsGroup(
      groupDto,
      tagsDto,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async tagsSearch(@Body('search') searchDto: SearchDto) {
    const result = await this.tagsService.tagsSearch(searchDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Post('create')
  async tagsCreate(@Body('create') tagsDto: TagsDto) {
    return await this.tagsService.tagsCreate(tagsDto);
  }

  // @Put('update')
  @Post('update')
  async tagsUpdate(@Body('update') tagsDto: TagsDto) {
    return await this.tagsService.tagsUpdate(tagsDto);
  }

  // @Delete('remove')
  @Post('remove')
  async tagsRemove(@Body('id') id: number) {
    return await this.tagsService.tagsRemove(id);
  }
}
