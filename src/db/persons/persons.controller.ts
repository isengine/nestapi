import { Controller } from '@nestjs/common';
import { PrivateController } from '@src/common/controller/private.controller';
import { PersonsDto } from './persons.dto';
import { PersonsEntity } from './persons.entity';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController extends PrivateController(
  'Персонажи',
  PersonsDto,
  PersonsEntity,
)<PersonsDto, PersonsEntity, PersonsService> {
  constructor(readonly service: PersonsService) {
    super();
  }
}
