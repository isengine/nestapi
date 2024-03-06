import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthDto } from '@src/auth/auth.dto';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';

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
    @Context() context,
  ): Promise<AuthDto> {
    return await this.authService.login(authDto, context.req);
  }

  @Mutation(() => AuthEntity)
  async register(
    @Args('register')
    authDto: AuthDto,
    @Context() context,
  ): Promise<AuthDto> {
    return await this.authService.register(authDto, context.req);
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
