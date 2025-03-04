import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { PersonsDto } from './persons.dto';
import { PersonsEntity } from './persons.entity';
import { BindDto } from '@src/common/dto/bind.dto';

@Injectable()
export class PersonsService extends CommonService<PersonsDto, PersonsEntity> {
  constructor(
    @InjectRepository(PersonsEntity)
    protected readonly repository: Repository<PersonsEntity>,
  ) {
    super();
  }

  async login(persons: PersonsDto): Promise<PersonsEntity> {
    const person = await this.findFirst({
      where: {
        username: persons.username,
      },
    });
    if (!person) {
      throw new UnauthorizedException('Person not found');
    }
    const isValidPassword = await compare(persons.password, person.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return person;
  }

  async create(
    persons: PersonsDto,
    relations: Array<RelationsDto> = undefined,
    bind: BindDto,
  ): Promise<PersonsEntity> {
    if (persons.password) {
      const salt = await genSalt(10);
      persons.password = await hash(persons.password, salt);
    }
    if (persons.username) {
      const exists = await this.findFirst({
        where: {
          username: persons.username,
        },
      });
      if (exists) {
        throw new BadRequestException('Person is exists', {
          cause: new Error(),
          description: 'invalid_person',
        });
      }
    }
    if (!persons.username) {
      persons.username = `${v4()}`;
    }
    const person = await super.create(persons, relations, bind);
    if (!person) {
      throw new BadRequestException(
        'Person is unknown, not registered, or parameters are set incorrectly',
        { cause: new Error(), description: 'invalid_person' },
      );
    }
    return person;
  }
}
