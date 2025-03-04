import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSessionsController } from './auth_sessions.controller';
import { AuthSessionsEntity } from './auth_sessions.entity';
import { AuthSessionsResolver } from './auth_sessions.resolver';
import { AuthSessionsService } from './auth_sessions.service';

@Module({
  controllers: [AuthSessionsController],
  imports: [TypeOrmModule.forFeature([AuthSessionsEntity])],
  providers: [AuthSessionsService, AuthSessionsResolver],
  exports: [AuthSessionsService],
})
export class AuthSessionsModule {}
