import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CategoriesDto } from '@src/categories/categories.dto';
import { CategoriesEntity } from '@src/categories/categories.entity';
import { CategoriesGroup } from '@src/categories/categories.group';
import { CategoriesService } from '@src/categories/categories.service';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';

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

  @Query(() => [CategoriesEntity])
  async categoriesFind(
    @Args('find')
    categoriesDto: CategoriesDto,
    @Args('options')
    findDto?: FindDto,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesService.categoriesFind(categoriesDto, findDto);
  }

  @Query(() => [CategoriesEntity])
  async categoriesFindIn(
    @Args('find')
    findInDto: FindInDto,
  ): Promise<CategoriesEntity[]> {
    return await this.categoriesService.categoriesFindIn(findInDto);
  }

  @Query(() => CategoriesEntity)
  async categoriesFindLastBy(
    @Args('find')
    categoriesDto: CategoriesDto,
  ): Promise<CategoriesEntity> {
    return await this.categoriesService.categoriesFindLastBy(categoriesDto);
  }

  @Query(() => [CategoriesGroup])
  async categoriesGroup(
    @Args('group')
    groupDto: GroupDto,
    @Args('where')
    categoriesDto?: CategoriesDto,
  ): Promise<CategoriesGroup[]> {
    return await this.categoriesService.categoriesGroup(
      groupDto,
      categoriesDto,
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
