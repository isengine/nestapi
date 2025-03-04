import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsGroupsModule } from './settings_groups/settings_groups.module';
import { SettingsController } from './settings.controller';
import { SettingsEntity } from './settings.entity';
import { SettingsResolver } from './settings.resolver';
import { SettingsService } from './settings.service';

@Module({
  controllers: [SettingsController],
  imports: [
    TypeOrmModule.forFeature([SettingsEntity]),
    forwardRef(() => SettingsGroupsModule),
  ],
  providers: [SettingsService, SettingsResolver],
  exports: [SettingsService],
})
export class SettingsModule {}
