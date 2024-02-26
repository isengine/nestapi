import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensController } from '@src/tokens/tokens.controller';
import { TokensEntity } from '@src/tokens/tokens.entity';
import { TokensService } from '@src/tokens/tokens.service';
import { TokensResolver } from '@src/tokens/tokens.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@src/config/jwt.config';

@Module({
  controllers: [TokensController],
  imports: [
    TypeOrmModule.forFeature([TokensEntity]),
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
