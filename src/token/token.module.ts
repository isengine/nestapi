import { Module, forwardRef } from '@nestjs/common';
import { TokenController } from '@src/token/token.controller';
import { TokenService } from '@src/token/token.service';
import { TokenResolver } from '@src/token/token.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@src/config/jwt.config';
import { ClientsModule } from '@src/clients/clients.module';
import { GrantsModule } from '@src/grants/grants.module';
import { OneTokenService } from '@src/token/service/one.token.service';
import { PairTokenService } from '@src/token/service/pair.token.service';
import { PrepareTokenService } from '@src/token/service/prepare.token.service';
import { RefreshTokenService } from '@src/token/service/refresh.token.service';
import { VerifyTokenService } from '@src/token/service/verify.token.service';

@Module({
  controllers: [TokenController],
  imports: [
    forwardRef(() => ConfigModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    forwardRef(() => ClientsModule),
    forwardRef(() => GrantsModule),
  ],
  providers: [
    TokenService,
    TokenResolver,
    OneTokenService,
    PairTokenService,
    PrepareTokenService,
    RefreshTokenService,
    VerifyTokenService,
  ],
  exports: [
    TokenService,
  ],
})
export class TokenModule {}
