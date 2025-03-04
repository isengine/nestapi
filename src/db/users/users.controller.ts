import { Controller } from '@nestjs/common';
import { PrivateController } from '@src/common/controller/private.controller';
import { UsersDto } from './users.dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends PrivateController(
  'Пользователи',
  UsersDto,
  UsersEntity,
)<UsersDto, UsersEntity, UsersService> {
  constructor(readonly service: UsersService) {
    super();
  }
}
