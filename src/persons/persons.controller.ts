import { Controller } from '@nestjs/common';
import { PersonsService } from '@src/persons/persons.service';
import { PersonsDto } from '@src/persons/persons.dto';
import { PrivateController } from '@src/common/controller/private.controller';
import { PersonsEntity } from '@src/persons/persons.entity';
import { PersonsFilter } from '@src/persons/persons.filter';

@Controller('persons')
export class PersonsController extends PrivateController(
  'Персонажи',
  PersonsEntity,
  PersonsDto,
)<
  PersonsService,
  PersonsEntity,
  PersonsDto,
  PersonsFilter
> {
  constructor(
    readonly service: PersonsService,
  ) {
    super();
  }
}
