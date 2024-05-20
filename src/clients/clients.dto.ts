import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from "@nestjs/swagger";
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { TypeClients } from '@src/common/common.enum';
import { RedirectsDto } from '@src/redirects/redirects.dto';

@InputType()
export class ClientsDto extends ProtectedDto {
  @ApiProperty({
    required: false,
    description: 'Уникальное имя клиентского приложения, по-умолчанию в формате uuid',
  })
  @Field({ nullable: true })
  client_id?: string;

  @ApiProperty({
    required: false,
    description: 'Секретный ключ, необходим для работы клиентского приложения',
  })
  @Field({ nullable: true })
  client_secret?: string;

  @ApiProperty({
    required: false,
    description: 'Пароль к клиентскому приложению',
  })
  @Field({ nullable: true })
  client_password?: string;

  @ApiProperty({
    required: false,
    description: 'Тип клиентского приложения',
  })
  @Field(() => TypeClients, {
    nullable: true,
    defaultValue: TypeClients.DEFAULT,
  })
  client_type?: TypeClients;

  @ApiProperty({
    required: false,
    description: 'Название клиентского приложения',
  })
  @Field({ nullable: true })
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Дополнительное поле с описанием или комментариями к клиентскому приложению',
  })
  @Field({ nullable: true })
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Дополнительное поле со ссылкой на сайт клиентского приложения',
  })
  @Field({ nullable: true })
  client_uri?: string;

  @ApiProperty({
    required: false,
    description: 'Поле с разрешенным редиректом, по которому сервер будет отправлять данные авторизации',
  })
  @Field({ nullable: true })
  redirect_uri?: string;

  @ApiProperty({
    required: false,
    description: 'Временный одноразовый код авторизации, выданный этому приложению',
  })
  @Field({ nullable: true })
  code?: string;

  @ApiProperty({
    required: false,
    description: 'Дата публикации, начиная с которой клиентское приложение будет активно',
  })
  @Field({ nullable: true })
  publishedAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Флаг публикации, отключение может сделать запись клиентское приложение недоступным',
  })
  @Field({ nullable: true })
  isPublished?: boolean;

  @ApiProperty({
    required: false,
    description: 'Данные редиректов, связанных с этим клиентским приложением',
  })
  @Field(() => [RedirectsDto], { nullable: true })
  redirects?: RedirectsDto[];
}
