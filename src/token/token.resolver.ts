import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { TokenDto } from '@src/token/token.dto';
import { TokenService } from '@src/token/token.service';

@Resolver('token')
export class TokenResolver {
  constructor(private readonly tokenService: TokenService) {}

  /*
  @Query(() => AuthEntity)
  async refresh(
    @Args('token')
    tokenDto: TokenDto,
    @Context() context,
  ): Promise<TokenDto> {
    return await this.tokenService.refresh(tokenDto.refresh_token, context.req);
  }
  */
}
