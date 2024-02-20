import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsFilter } from '@src/tags/tags.filter';
import { TagsService } from '@src/tags/tags.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Tags')
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [TagsEntity])
  async tagsGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsGetAll(relationsDto);
  }

  @Query(() => TagsEntity)
  async tagsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TagsEntity> {
    return await this.tagsService.tagsGetOne(id, relationsDto);
  }

  @Query(() => [TagsEntity])
  async tagsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsGetMany(ids, relationsDto);
  }

  @Query(() => [TagsFilter])
  async tagsFilter(
    @Args('filter')
    tagsDto: TagsDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TagsFilter[]> {
    return await this.tagsService.tagsFilter(tagsDto, optionsDto, relationsDto);
  }

  @Query(() => [TagsFilter])
  async tagsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TagsFilter[]> {
    return await this.tagsService.tagsSearch(searchDto, optionsDto, relationsDto);
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
