import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthEntity } from '@src/auth/auth.entity';
import { TokensDto } from '@src/tokens/tokens.dto';
import { TokensEntity } from '@src/tokens/tokens.entity';
import { TokensFilter } from '@src/tokens/tokens.filter';
import { TokensService } from '@src/tokens/tokens.service';
import { OptionsDto } from '@src/typeorm/dto/options.dto';
import { RelationsDto } from '@src/typeorm/dto/relations.dto';
import { SearchDto } from '@src/typeorm/dto/search.dto';

@Resolver('Tokens')
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @Query(() => AuthEntity)
  async tokensRefresh(
    @Args('tokens')
    tokensDto: TokensDto,
    @Context() context,
  ): Promise<TokensDto> {
    return await this.tokensService.tokensRefresh(tokensDto, context.req);
  }

  @Query(() => [TokensEntity])
  async tokensGetAll(
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TokensEntity[]> {
    return await this.tokensService.tokensGetAll(relationsDto);
  }

  @Query(() => TokensEntity)
  async tokensGetOne(
    @Args('id')
    id: number,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TokensEntity> {
    return await this.tokensService.tokensGetOne(id, relationsDto);
  }

  @Query(() => [TokensEntity])
  async tokensGetMany(
    @Args('ids', { type: () => [Number || String] })
    ids: Array<number | string>,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TokensEntity[]> {
    return await this.tokensService.tokensGetMany(ids, relationsDto);
  }

  @Query(() => [TokensFilter])
  async tokensFilter(
    @Args('filter')
    tokensDto: TokensDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TokensFilter[]> {
    return await this.tokensService.tokensFilter(tokensDto, optionsDto, relationsDto);
  }

  @Query(() => [TokensFilter])
  async tokensSearch(
    @Args('search')
    searchDto: SearchDto,
    @Args('options', { nullable: true, defaultValue: {}, type: () => OptionsDto })
    optionsDto: OptionsDto,
    @Args('relations', { nullable: true, defaultValue: [], type: () => [RelationsDto] })
    relationsDto: Array<RelationsDto>,
  ): Promise<TokensFilter[]> {
    return await this.tokensService.tokensSearch(
      searchDto,
      optionsDto,
      relationsDto,
    );
  }

  @Mutation(() => TokensEntity)
  async tokensCreate(
    @Args('create')
    tokensDto: TokensDto,
  ): Promise<TokensEntity> {
    return await this.tokensService.tokensCreate(tokensDto);
  }

  @Mutation(() => TokensEntity)
  async tokensUpdate(
    @Args('update')
    tokensDto: TokensDto,
  ): Promise<TokensEntity> {
    return await this.tokensService.tokensUpdate(tokensDto);
  }

  @Mutation(() => Number)
  async tokensRemove(
    @Args('id')
    id: number,
  ): Promise<boolean> {
    return await this.tokensService.tokensRemove(id);
  }
}
