import { Module, forwardRef } from '@nestjs/common';
import { TokenController } from '@src/token/token.controller';
import { TokenService } from '@src/token/token.service';
import { TokenResolver } from '@src/token/token.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@src/config/jwt.config';
import { AuthModule } from '@src/auth/auth.module';
import { ClientsModule } from '@src/clients/clients.module';
import { GrantsTokenService } from '@src/token/service/grants.service';

@Module({
  controllers: [TokenController],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => ClientsModule),
  ],
  providers: [
    TokenService,
    GrantsTokenService,
    TokenResolver,
  ],
  exports: [
    TokenService,
    GrantsTokenService,
  ],
})
export class TokenModule {}
