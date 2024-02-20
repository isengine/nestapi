import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsFilter } from '@src/posts/posts.filter';
import { PostsService } from '@src/posts/posts.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Posts')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [PostsEntity])
  async postsGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsGetAll(relationsDto);
  }

  @Query(() => PostsEntity)
  async postsGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<PostsEntity> {
    return await this.postsService.postsGetOne(id, relationsDto);
  }

  @Query(() => [PostsEntity])
  async postsGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsGetMany(ids, relationsDto);
  }

  @Query(() => [PostsFilter])
  async postsFilter(
    @Args('filter')
    postsDto: PostsDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<PostsFilter[]> {
    return await this.postsService.postsFilter(postsDto, optionsDto, relationsDto);
  }

  @Query(() => [PostsFilter])
  async postsSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<PostsFilter[]> {
    return await this.postsService.postsSearch(
      searchDto,
      optionsDto,
      relationsDto,
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
