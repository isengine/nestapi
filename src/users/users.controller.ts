import { Controller } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { UsersDto } from '@src/users/users.dto';
import { PrivateController } from '@src/common/controller/private.controller';
import { UsersEntity } from '@src/users/users.entity';
import { UsersFilter } from '@src/users/users.filter';

@Controller('users')
export class UsersController extends PrivateController(
  'Пользователи',
  UsersEntity,
  UsersDto,
)<
  UsersService,
  UsersEntity,
  UsersDto,
  UsersFilter
> {
  constructor(
    readonly service: UsersService,
  ) {
    super();
  }
}
