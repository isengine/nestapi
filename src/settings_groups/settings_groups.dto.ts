import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { SettingsDto } from '@src/settings/settings.dto';

@InputType()
export class SettingsGroupsDto extends ClosedDto {
  @ApiProperty({
    required: false,
    description: 'Имя группы',
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
    description: 'Позиция для ручной сортировки',
  })
  @Field({ nullable: true })
  order?: number;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Флаг, который показывает, выключена или нет эта группа',
  })
  @Field({ nullable: true, defaultValue: false })
  isDisabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'Данные настроек, входящих в данную группу',
  })
  @Field(() => [SettingsDto], { nullable: true })
  settings?: SettingsDto[];
}
