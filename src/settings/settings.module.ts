import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from '@src/settings/settings.controller';
import { SettingsEntity } from '@src/settings/settings.entity';
import { SettingsService } from '@src/settings/settings.service';
import { SettingsResolver } from '@src/settings/settings.resolver';
import { SettingsGroupsModule } from '@src/settings_groups/settings_groups.module';

@Module({
  controllers: [SettingsController],
  imports: [
    TypeOrmModule.forFeature([SettingsEntity]),
    forwardRef(() => SettingsGroupsModule),
  ],
  providers: [
    SettingsService,
    SettingsResolver,
  ],
  exports: [SettingsService],
})
export class SettingsModule {}
