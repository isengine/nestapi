import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from '@src/auth/auth.service';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { MixinDto } from '@src/auth/dto/mixin.dto';
import { TokensDto } from './dto/tokens.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // @Query(() => [AuthEntity])
  // async authGetAll(): Promise<AuthEntity[]> {
  //   return await this.authService.authGetAll();
  // }

  @Query(() => AuthEntity)
  async login(
    @Args('login')
    authDto: AuthDto,
  ): Promise<MixinDto> {
    return await this.authService.login(authDto);
  }

  @Mutation(() => AuthEntity)
  async register(
    @Args('register')
    authDto: AuthDto,
  ): Promise<MixinDto> {
    return await this.authService.register(authDto);
  }

  @Query(() => AuthEntity)
  async refreshTokens(
    @Args('tokens')
    tokensDto: TokensDto,
  ): Promise<TokensDto> {
    return await this.authService.refreshTokens(tokensDto);
  }

  // @Mutation(() => AuthEntity)
  // async authUpdate(
  //   @Args('update')
  //   authDto: AuthDto,
  // ): Promise<AuthEntity> {
  //   return await this.authService.authUpdate(authDto);
  // }

  // @Mutation(() => Number)
  // async authRemove(
  //   @Args('id')
  //   id: number,
  // ): Promise<boolean> {
  //   return await this.authService.authRemove(id);
  // }
}
