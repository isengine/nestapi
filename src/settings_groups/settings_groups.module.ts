import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsGroupsController } from '@src/settings_groups/settings_groups.controller';
import { SettingsGroupsEntity } from '@src/settings_groups/settings_groups.entity';
import { SettingsGroupsService } from '@src/settings_groups/settings_groups.service';
import { SettingsGroupsResolver } from '@src/settings_groups/settings_groups.resolver';
import { SettingsModule } from '@src/settings/settings.module';

@Module({
  controllers: [SettingsGroupsController],
  imports: [
    TypeOrmModule.forFeature([SettingsGroupsEntity]),
    forwardRef(() => SettingsModule),
  ],
  providers: [
    SettingsGroupsService,
    SettingsGroupsResolver,
  ],
  exports: [SettingsGroupsService],
})
export class SettingsGroupsModule {}
