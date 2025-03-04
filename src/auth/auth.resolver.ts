import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { AuthDto } from './auth.dto';
import { AuthEntity } from './auth.entity';
import { AuthService } from './auth.service';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // @Query(() => [AuthEntity])
  // async authGetAll(): Promise<AuthEntity[]> {
  //   return await this.authService.authGetAll();
  // }

  // @Query(() => AuthEntity)
  // async login(
  //   @Args('login')
  //   authDto: AuthDto,
  //   // @Context() context,
  // ): Promise<AuthEntity> {
  //   // return await this.authService.login(authDto, context.req);
  //   return await this.authService.login(authDto);
  // }

  // @Mutation(() => AuthEntity)
  // async register(
  //   @Args('register')
  //   authDto: AuthDto,
  //   // @Context() context,
  // ): Promise<AuthEntity> {
  //   // return await this.authService.register(authDto, context.req);
  //   return await this.authService.register(authDto);
  // }

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
