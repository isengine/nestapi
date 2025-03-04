import { Controller } from '@nestjs/common';
import { ClosedController } from '@src/common/controller/closed.controller';
import { SettingsDto } from './settings.dto';
import { SettingsEntity } from './settings.entity';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController extends ClosedController(
  'Настройки',
  SettingsDto,
  SettingsEntity,
)<SettingsDto, SettingsEntity, SettingsService> {
  constructor(readonly service: SettingsService) {
    super();
  }
}
