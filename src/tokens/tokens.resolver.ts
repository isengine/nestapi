import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthEntity } from '@src/auth/auth.entity';
import { TokensDto } from '@src/tokens/tokens.dto';
import { TokensService } from '@src/tokens/tokens.service';

@Resolver('Tokens')
export class TokensResolver {
  constructor(private readonly tokensService: TokensService) {}

  @Query(() => AuthEntity)
  async tokensRefresh(
    @Args('tokens')
    tokensDto: TokensDto,
    @Context() context,
  ): Promise<TokensDto> {
    return await this.tokensService.tokensRefresh(tokensDto.refresh_token, context.req);
  }
}
