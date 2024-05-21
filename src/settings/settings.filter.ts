import { ObjectType } from '@nestjs/graphql';
import { SettingsEntity } from '@src/settings/settings.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class SettingsFilter extends FilterType(SettingsEntity) {}
