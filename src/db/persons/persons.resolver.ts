import { Resolver } from '@nestjs/graphql';
import { PrivateResolver } from '@src/common/resolver/private.resolver';
import { PersonsDto } from './persons.dto';
import { PersonsEntity } from './persons.entity';
import { PersonsService } from './persons.service';

@Resolver(PersonsEntity)
export class PersonsResolver extends PrivateResolver(
  'persons',
  PersonsDto,
  PersonsEntity,
)<PersonsDto, PersonsEntity, PersonsService> {
  constructor(readonly service: PersonsService) {
    super();
  }
}
