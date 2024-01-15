import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { PostsService } from '@src/posts/posts.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Posts')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [PostsEntity])
  async postsGetAll(
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsGetAll(relations);
  }

  @Query(() => PostsEntity)
  async postsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<PostsEntity> {
    return await this.postsService.postsGetOne(id, relations);
  }

  @Query(() => [PostsEntity])
  async postsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsGetMany(ids, relations);
  }

  @Query(() => [PostsFilter])
  async postsFilter(
    @Args('filter')
    postsDto: PostsDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<PostsFilter[]> {
    return await this.postsService.postsFilter(postsDto, optionsDto, relations);
  }

  @Query(() => [PostsFilter])
  async postsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options')
    optionsDto: OptionsDto,
    @Args('relations', { type: () => [String], defaultValue: null })
    relations: Array<string>,
  ): Promise<PostsFilter[]> {
    return await this.postsService.postsSearch(
      searchDto,
      optionsDto,
      relations,
    );
  }

  @Mutation(() => PostsEntity)
  async postsCreate(
    @Args('create')
    postsDto: PostsDto,
  ): Promise<PostsEntity> {
    return await this.postsService.postsCreate(postsDto);
  }

  @Mutation(() => PostsEntity)
  async postsUpdate(
    @Args('update')
    postsDto: PostsDto,
  ): Promise<PostsEntity> {
    return await this.postsService.postsUpdate(postsDto);
  }

  @Mutation(() => Number)
  async postsRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.postsService.postsRemove(id);
  }
}
