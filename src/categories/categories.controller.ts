// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesDto } from '@src/categories/categories.dto';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('get_all')
  async categoriesGetAll(@Body('relations') relations: Array<string>) {
    return await this.categoriesService.categoriesGetAll(relations);
  }

  @Get('get_one')
  async categoriesGetOne(
    @Body('id') id: number,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesGetOne(id, relations);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async categoriesGetMany(
    @Body('ids') ids: Array<number | string>,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesGetMany(
      ids,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('filter')
  async categoriesFilter(
    @Body('filter') categoriesDto: CategoriesDto,
    @Body('options') optionsDto: OptionsDto,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesFilter(
      categoriesDto,
      optionsDto,
      relations,
    );
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('search')
  async categoriesSearch(
    @Body('search') searchDto: SearchDto,
    @Body('options') optionsDto: OptionsDto,
    @Body('relations') relations: Array<string>,
  ) {
    const result = await this.categoriesService.categoriesSearch(
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
  async categoriesCreate(@Body('create') categoriesDto: CategoriesDto) {
    return await this.categoriesService.categoriesCreate(categoriesDto);
  }

  // @Put('update')
  @Post('update')
  async categoriesUpdate(@Body('update') categoriesDto: CategoriesDto) {
    return await this.categoriesService.categoriesUpdate(categoriesDto);
  }

  // @Delete('remove')
  @Post('remove')
  async categoriesRemove(@Body('id') id: number) {
    return await this.categoriesService.categoriesRemove(id);
  }
}
