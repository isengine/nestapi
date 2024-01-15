import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { getJwtConfig } from '@src/config/jwt.config';
import { JwtStrategy } from '@src/auth/strategy/jwt.strategy';
import { AuthController } from '@src/auth/auth.controller';
import { AuthEntity } from '@src/auth/auth.entity';
import { AuthService } from '@src/auth/auth.service';
import { AuthResolver } from '@src/auth/auth.resolver';
import { GoogleStrategy } from '@src/auth/strategy/google.strategy';
import { SessionSerializer } from '@src/auth/session/serialize.session';
import { UsersModule } from '@src/users/users.module';
import { SessionModule } from '@src/session/session.module';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    forwardRef(() => UsersModule),
    forwardRef(() => SessionModule),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
  ],
  exports: [AuthService],
})
export class AuthModule {}
