import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthSessionsController } from '@src/auth_sessions/auth_sessions.controller';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { AuthSessionsService } from '@src/auth_sessions/auth_sessions.service';
import { AuthSessionsResolver } from '@src/auth_sessions/auth_sessions.resolver';

@Module({
  controllers: [AuthSessionsController],
  imports: [TypeOrmModule.forFeature([AuthSessionsEntity])],
  providers: [
    AuthSessionsService,
    AuthSessionsResolver,
  ],
  exports: [AuthSessionsService],
})
export class AuthSessionsModule {}
