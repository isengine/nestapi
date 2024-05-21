import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { TypeValues } from '@src/common/common.enum';
import { SettingsGroupsDto } from '@src/settings_groups/settings_groups.dto';

@InputType()
export class SettingsDto extends ClosedDto {
  @ApiProperty({
    required: false,
    description: 'Имя для настройки',
  })
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Описание или комментарий',
  })
  @Field({ nullable: true })
  description?: string;

  @ApiProperty({
    required: false,
    description: 'группа настроек',
  })
  @Field(() => SettingsGroupsDto, { nullable: true })
  group?: SettingsGroupsDto;

  @ApiProperty({
    required: false,
    description: 'Тип данных',
  })
  @Field(() => TypeValues, {
    nullable: true,
    defaultValue: TypeValues.DEFAULT,
  })
  // @IsEnum(TypeValues)
  // @NotEquals(TypeValues[TypeValues.DEFAULT])
  type?: TypeValues;

  @ApiProperty({
    required: false,
    description: 'Позиция для ручной сортировки',
  })
  @Field({ nullable: true })
  order?: number;

  @ApiProperty({
    required: false,
    description: 'Значение по-умолчанию',
  })
  @Field({ nullable: true })
  default?: string;

  @ApiProperty({
    required: false,
    description: 'Значение',
  })
  @Field({ nullable: true })
  value?: string;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Флаг, который показывает, выключена или нет эта настройка',
  })
  @Field({ nullable: true, defaultValue: false })
  isDisabled?: boolean;
}
