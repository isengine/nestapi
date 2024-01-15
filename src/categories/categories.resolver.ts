import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesFilter } from '@src/categories/categories.filter';
import { CategoriesService } from '@src/categories/categories.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Categories')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [CategoriesEntity])
  async categoriesGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesService.categoriesGetAll(relations);
  }

  @Query(() => CategoriesEntity)
  async categoriesGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<CategoriesEntity> {
    return await this.categoriesService.categoriesGetOne(id, relations);
  }

  @Query(() => [CategoriesEntity])
  async categoriesGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesService.categoriesGetMany(ids, relations);
  }

  @Query(() => [CategoriesFilter])
  async categoriesFilter(
    @Args('filter')
    categoriesDto: CategoriesDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<CategoriesFilter[]> {
    return await this.categoriesService.categoriesFilter(
      categoriesDto,
      optionsDto,
      relations,
    );
  }

  @Query(() => [CategoriesFilter])
  async categoriesSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<CategoriesFilter[]> {
    return await this.categoriesService.categoriesSearch(
      searchDto,
      optionsDto,
      relations,
    );
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
