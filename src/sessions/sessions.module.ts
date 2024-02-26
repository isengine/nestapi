import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionsController } from '@src/sessions/sessions.controller';
import { SessionsEntity } from '@src/sessions/sessions.entity';
import { SessionsService } from '@src/sessions/sessions.service';
import { SessionsResolver } from '@src/sessions/sessions.resolver';

@Module({
  controllers: [SessionsController],
  imports: [TypeOrmModule.forFeature([SessionsEntity])],
  providers: [SessionsService, SessionsResolver],
  exports: [SessionsService],
})
export class SessionsModule {}
