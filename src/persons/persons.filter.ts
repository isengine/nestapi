import { ObjectType } from '@nestjs/graphql';
import { PersonsEntity } from '@src/persons/persons.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class PersonsFilter extends FilterType(PersonsEntity) {}
