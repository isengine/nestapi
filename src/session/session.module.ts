import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionController } from '@src/session/session.controller';
import { SessionEntity } from '@src/session/session.entity';
import { SessionService } from '@src/session/session.service';
import { SessionResolver } from '@src/session/session.resolver';

@Module({
  controllers: [SessionController],
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionService, SessionResolver],
  exports: [SessionService],
})
export class SessionModule {}
