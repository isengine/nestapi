import { Args, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthEntity } from '@src/auth/auth.entity';
import { TokenDto } from '@src/token/dto/token.dto';
import { TokenService } from '@src/token/service/token.service';

@Resolver('Token')
export class TokenResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Query(() => AuthEntity)
  async tokenRefresh(
    @Args('token')
    tokenDto: TokenDto,
    @Context() context,
  ): Promise<TokenDto> {
    return await this.tokenService.tokenRefresh(tokenDto.refresh_token, context.req);
  }
}
