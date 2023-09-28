import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostsService } from '@src/posts/posts.service';
import { PostsEntity } from '@src/posts/posts.entity';
import { PostsDto } from '@src/posts/posts.dto';
import { FindInDto } from '@src/typeorm/dto/findIn.dto';
import { GetManyDto } from '@src/typeorm/dto/getMany.dto';

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
  async postsFindIn(
    @Args('find')
    findInDto: FindInDto,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsFindIn(findInDto);
  }

  @Query(() => [PostsEntity])
  async postsFindBy(
    @Args('find')
    postsDto: PostsDto,
  ): Promise<PostsEntity[]> {
    return await this.postsService.postsFindBy(postsDto);
  }

  @Query(() => PostsEntity)
  async postsFindLastBy(
    @Args('find')
    postsDto: PostsDto,
  ): Promise<PostsEntity> {
    return await this.postsService.postsFindLastBy(postsDto);
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
