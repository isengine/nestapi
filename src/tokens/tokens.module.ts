import { Module, forwardRef } from '@nestjs/common';
import { TokensController } from '@src/tokens/tokens.controller';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensResolver } from '@src/tokens/tokens.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@src/config/jwt.config';
import { AuthModule } from '@src/auth/auth.module';
import { ClientsModule } from '@src/clients/clients.module';
import { TokensGrantsService } from './service/tokens.grants.service';

@Module({
  controllers: [TokensController],
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
    TokensService,
    TokensGrantsService,
    TokensResolver,
  ],
  exports: [
    TokensService,
    TokensGrantsService,
  ],
})
export class TokensModule {}
