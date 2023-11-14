import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsThemesController } from '@src/events.themes/events.themes.controller';
import { EventsThemesEntity } from '@src/events.themes/events.themes.entity';
import { EventsThemesService } from '@src/events.themes/events.themes.service';

@Module({
  controllers: [EventsThemesController],
  imports: [TypeOrmModule.forFeature([EventsThemesEntity])],
  providers: [EventsThemesService],
  exports: [EventsThemesService],
})
export class EventsThemesModule {}
