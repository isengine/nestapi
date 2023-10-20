import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TagsDto } from '@src/tags/tags.dto';
import { TagsEntity } from '@src/tags/tags.entity';
import { TagsSearch } from '@src/tags/tags.search';
import { TagsService } from '@src/tags/tags.service';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupByDto } from '@src/typeorm/dto/groupBy.dto';

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
  async tagsFindIn(
    @Args('find')
    findInDto: FindInDto,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsFindIn(findInDto);
  }

  @Query(() => [TagsEntity])
  async tagsFindBy(
    @Args('find')
    tagsDto: TagsDto,
  ): Promise<TagsEntity[]> {
    return await this.tagsService.tagsFindBy(tagsDto);
  }

  @Query(() => TagsEntity)
  async tagsFindLastBy(
    @Args('find')
    tagsDto: TagsDto,
  ): Promise<TagsEntity> {
    return await this.tagsService.tagsFindLastBy(tagsDto);
  }

  @Query(() => [TagsSearch])
  async tagsGroupBy(
    @Args('group')
    groupByDto: GroupByDto,
    @Args('where')
    tagsDto?: TagsDto,
  ): Promise<TagsSearch[]> {
    return await this.tagsService.tagsGroupBy(
      groupByDto,
      tagsDto,
    );
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
