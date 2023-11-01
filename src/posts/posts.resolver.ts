import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostsDto } from '@src/posts/posts.dto';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsGroup } from '@src/posts/posts.group';
import { PostsService } from '@src/posts/posts.service';
import { FindDto } from '@src/typeorm/dto/find.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';
import { GroupDto } from '@src/typeorm/dto/group.dto';

@Resolver('Posts')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [PostsEntity])
  async postsGetAll(): Promise<PostsEntity[]> {
    return await this.postsService.postsGetAll();
  }

  @Query(() => PostsEntity)
  async postsGetOne(
    @Args('id')
    id: number,
  ): Promise<PostsEntity> {
    return await this.postsService.postsGetOne(id);
  }

  @Query(() => [PostsEntity])
  async postsGetMany(
    @Args('ids')
    getMany: GetManyDto,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsGetMany(getMany);
  }

  @Query(() => [PostsEntity])
  async postsFind(
    @Args('find')
    postsDto: PostsDto,
    @Args('options')
    findDto?: FindDto,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsFind(postsDto, findDto);
  }

  @Query(() => [PostsEntity])
  async postsFindIn(
    @Args('find')
    findInDto: FindInDto,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsFindIn(findInDto);
  }

  @Query(() => PostsEntity)
  async postsFindLastBy(
    @Args('find')
    postsDto: PostsDto,
  ): Promise<PostsEntity> {
    return await this.postsService.postsFindLastBy(postsDto);
  }

  @Query(() => [PostsGroup])
  async postsGroup(
    @Args('group')
    groupDto: GroupDto,
    @Args('where')
    postsDto?: PostsDto,
  ): Promise<PostsGroup[]> {
    return await this.postsService.postsGroup(
      groupDto,
      postsDto,
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
