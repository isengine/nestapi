import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsGroup } from '@src/tags/tags.group';
import { TagsService } from '@src/tags/tags.service';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';
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
    @Args('ids')
    getMany: GetManyDto,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsGetMany(getMany);
  }

  @Query(() => [TagsEntity])
  async tagsFind(
    @Args('find')
    tagsDto: TagsDto,
    @Args('options')
    findDto?: FindDto,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsFind(tagsDto, findDto);
  }

  @Query(() => [TagsGroup])
  async tagsGroup(
    @Args('group')
    groupDto: GroupDto,
    @Args('where')
    tagsDto?: TagsDto,
  ): Promise<TagsGroup[]> {
    return await this.tagsService.tagsGroup(
      groupDto,
      tagsDto,
    );
  }

  @Query(() => [TagsEntity])
  async tagsSearch(
    @Args('search')
    searchDto: SearchDto,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsSearch(searchDto);
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
