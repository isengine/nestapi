import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';
import { CategoriesService } from '@src/categories/categories.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Categories')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [CategoriesEntity])
  async categoriesGetAll(): Promise<CategoriesEntity[]> {
    return await this.categoriesService.categoriesGetAll();
  }

  @Query(() => CategoriesEntity)
  async categoriesGetOne(
    @Args('id')
    id: number,
  ): Promise<CategoriesEntity> {
    return await this.categoriesService.categoriesGetOne(id);
  }

  @Query(() => [CategoriesEntity])
  async categoriesGetMany(
    @Args('ids')
    getMany: GetManyDto,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesService.categoriesGetMany(getMany);
  }

  @Query(() => [CategoriesFilter])
  async categoriesFilter(
    @Args('filter')
    categoriesDto: CategoriesDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<CategoriesFilter[]> {
    return await this.categoriesService.categoriesFilter(categoriesDto, optionsDto);
  }

  @Query(() => [CategoriesFilter])
  async categoriesSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<CategoriesFilter[]> {
    return await this.categoriesService.categoriesSearch(searchDto, optionsDto);
  }

  @Mutation(() => CategoriesEntity)
  async categoriesCreate(
    @Args('create')
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity> {
    return await this.categoriesService.categoriesCreate(categoriesDto);
  }

  @Mutation(() => CategoriesEntity)
  async categoriesUpdate(
    @Args('update')
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity> {
    return await this.categoriesService.categoriesUpdate(categoriesDto);
  }

  @Mutation(() => Number)
  async categoriesRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.categoriesService.categoriesRemove(id);
  }
}
