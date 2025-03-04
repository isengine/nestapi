import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from '../settings.module';
import { SettingsGroupsController } from './settings_groups.controller';
import { SettingsGroupsEntity } from './settings_groups.entity';
import { SettingsGroupsService } from './settings_groups.service';
import { SettingsGroupsResolver } from './settings_groups.resolver';

@Module({
  controllers: [SettingsGroupsController],
  imports: [
    TypeOrmModule.forFeature([SettingsGroupsEntity]),
    forwardRef(() => SettingsModule),
  ],
  providers: [SettingsGroupsService, SettingsGroupsResolver],
  exports: [SettingsGroupsService],
})
export class SettingsGroupsModule {}
