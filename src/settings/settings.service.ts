import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsDto } from '@src/settings/settings.dto';
import { SettingsEntity } from '@src/settings/settings.entity';
import { SettingsFilter } from '@src/settings/settings.filter';
import { CommonService } from '@src/common/common.service';

@Injectable()
export class SettingsService extends CommonService<
  SettingsEntity,
  SettingsDto,
  SettingsFilter
> {
  constructor(
    @InjectRepository(SettingsEntity)
    protected readonly repository: Repository<SettingsEntity>,
  ) {
    super();
  }
}
