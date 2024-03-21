import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from '@src/auth/auth.dto';
// import { IsEnum, NotEquals } from 'class-validator';
import { CommonDto } from '@src/common/dto/common.dto';
import { GenderUsers } from '@src/users/users.enum';

@InputType()
export class UsersDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Контактный email, не обязательно совпадает с логином',
  })
  @Field({ nullable: true })
  email?: string;

  @ApiProperty({
    required: false,
    description: 'Контактный телефон',
  })
  @Field({ nullable: true })
  phone?: string;

  @ApiProperty({
    required: false,
    description: 'Имя',
  })
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Фамилия',
  })
  @Field({ nullable: true })
  lastName?: string;

  @ApiProperty({
    required: false,
    description: 'Отчество',
  })
  @Field({ nullable: true })
  parentName?: string;

  @ApiProperty({
    required: false,
    description: 'Ссылка на аватарку',
  })
  @Field({ nullable: true })
  avatar?: string;

  @ApiProperty({
    required: false,
    description: 'Дата рождения',
  })
  @Field({ nullable: true })
  birthday?: Date;

  @ApiProperty({
    required: false,
    description: 'Предпочитаемый язык',
  })
  @Field({ nullable: true })
  locale?: string;

  @ApiProperty({
    required: false,
    description: 'Адрес',
  })
  @Field({ nullable: true })
  address?: string;

  @ApiProperty({
    required: false,
    description: 'Временна зона в формате +/-00:00',
  })
  @Field({ nullable: true })
  timezone?: string;

  @ApiProperty({
    required: false,
    description: 'Пол',
  })
  @Field(() => GenderUsers, {
    nullable: true,
    defaultValue: GenderUsers.DEFAULT,
  })
  // @IsEnum(GenderUsers)
  // @NotEquals(GenderUsers[GenderUsers.DEFAULT])
  gender?: GenderUsers;

  @ApiProperty({
    required: false,
    description: 'Данные auth записи, связанной с данным пользователем',
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
