import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from '@src/events/events.controller';
import { EventsEntity } from '@src/events/events.entity';
import { EventsGateway } from '@src/events/events.gateway';
import { EventsService } from '@src/events/events.service';
import { EventsThemesModule } from '@src/events.themes/events.themes.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  controllers: [EventsController],
  imports: [
    TypeOrmModule.forFeature([EventsEntity]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsThemesModule),
  ],
  providers: [EventsService, EventsGateway],
  exports: [EventsService],
})
export class EventsModule {}
