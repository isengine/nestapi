// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { TagsService } from '@src/tags/tags.service';
import { TagsDto } from '@src/tags/tags.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
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
  async tagsGetMany(@Body('ids') ids: Array<number | string>) {
    const result = await this.tagsService.tagsGetMany(ids);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async tagsFilter(
    @Body('filter') tagsDto: TagsDto,
    @Body('options') optionsDto: OptionsDto,
  ) {
    const result = await this.tagsService.tagsFilter(tagsDto, optionsDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async tagsSearch(
    @Body('search') searchDto: SearchDto,
    @Body('options') optionsDto: OptionsDto,
  ) {
    const result = await this.tagsService.tagsSearch(searchDto, optionsDto);
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
