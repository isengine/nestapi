// import { Body, Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { Body, Controller, Get, Post, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '@src/categories/categories.service';
import { CategoriesDto } from '@src/categories/categories.dto';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('get_all')
  async categoriesGetAll() {
    return await this.categoriesService.categoriesGetAll();
  }

  @Get('get_one')
  async categoriesGetOne(@Body('id') id: number) {
    const result = await this.categoriesService.categoriesGetOne(id);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('get_many')
  async categoriesGetMany(@Body('ids') getMany: GetManyDto) {
    const result = await this.categoriesService.categoriesGetMany(getMany);
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('find')
  async categoriesFind(
    @Body('find') categoriesDto: CategoriesDto,
    @Body('options') findDto?: FindDto,
  ) {
    const result = await this.categoriesService.categoriesFind(categoriesDto, findDto);
    if (!result) {
      throw new NotFoundException('Any results not found');
    }
    return result;
  }

  @Get('find_in')
  async categoriesFindIn(@Body('find') findInDto: FindInDto) {
    const result = await this.categoriesService.categoriesFindIn(findInDto);
    if (!result) {
      throw new NotFoundException('Any entries not found');
    }
    return result;
  }

  @Get('find_last_by')
  async categoriesFindLastBy(@Body('find') categoriesDto: CategoriesDto) {
    const result = await this.categoriesService.categoriesFindLastBy(
      categoriesDto,
    );
    if (!result) {
      throw new NotFoundException('Entry not found');
    }
    return result;
  }

  @Get('group')
  async categoriesGroup(
    @Body('group') groupDto: GroupDto,
    @Body('where') categoriesDto: CategoriesDto,
  ) {
    const result = await this.categoriesService.categoriesGroup(
      groupDto,
      categoriesDto,
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
