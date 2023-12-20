import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
import { TagsService } from '@src/tags/tags.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Tags')
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [TagsEntity])
  async tagsGetAll(): Promise<TagsEntity[]> {
    return await this.tagsService.tagsGetAll();
  }

  @Query(() => TagsEntity)
  async tagsGetOne(
    @Args('id')
    id: number,
  ): Promise<TagsEntity> {
    return await this.tagsService.tagsGetOne(id);
  }

  @Query(() => [TagsEntity])
  async tagsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsGetMany(ids);
  }

  @Query(() => [TagsFilter])
  async tagsFilter(
    @Args('filter')
    tagsDto: TagsDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<TagsFilter[]> {
    return await this.tagsService.tagsFilter(tagsDto, optionsDto);
  }

  @Query(() => [TagsFilter])
  async tagsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
  ): Promise<TagsFilter[]> {
    return await this.tagsService.tagsSearch(searchDto, optionsDto);
  }

  @Mutation(() => TagsEntity)
  async tagsCreate(
    @Args('create')
    tagsDto: TagsDto,
  ): Promise<TagsEntity> {
    return await this.tagsService.tagsCreate(tagsDto);
  }

  @Mutation(() => TagsEntity)
  async tagsUpdate(
    @Args('update')
    tagsDto: TagsDto,
  ): Promise<TagsEntity> {
    return await this.tagsService.tagsUpdate(tagsDto);
  }

  @Mutation(() => Number)
  async tagsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.tagsService.tagsRemove(id);
  }
}
