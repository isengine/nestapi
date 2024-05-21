import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { OAuthDto } from '@src/oauth/oauth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { OAuthService } from '@src/oauth/oauth.service';

@Resolver('oauth')
export class OAuthResolver {
  constructor(private readonly oauthService: OAuthService) {}

  // @Query(() => [AuthEntity])
  // async oauthGetAll(): Promise<AuthEntity[]> {
  //   return await this.oauthService.oauthGetAll();
  // }
}
