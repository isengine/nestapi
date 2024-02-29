import { Module } from '@nestjs/common';
import { TokensController } from '@src/tokens/tokens.controller';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensResolver } from '@src/tokens/tokens.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@src/config/jwt.config';

@Module({
  controllers: [TokensController],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  providers: [TokensService, TokensResolver],
  exports: [TokensService],
})
export class TokensModule {}
