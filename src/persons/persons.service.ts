import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonsDto } from '@src/persons/persons.dto';
import { PersonsEntity } from '@src/persons/persons.entity';
import { PersonsFilter } from '@src/persons/persons.filter';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { CommonService } from '@src/common/common.service';
import { TokenService } from '@src/token/token.service';

@Injectable()
export class PersonsService extends CommonService<
  PersonsEntity,
  PersonsDto,
  PersonsFilter
> {
  constructor(
    @InjectRepository(PersonsEntity)
    protected readonly repository: Repository<PersonsEntity>,
    protected readonly tokenService: TokenService,
  ) {
    super();
  }

  async login(personsDto: PersonsDto): Promise<PersonsEntity> {
    const person = await this.first({
      username: personsDto.username,
    });
    if (!person) {
      throw new UnauthorizedException('Person not found');
    }
    const isValidPassword = await compare(personsDto.password, person.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    return person;
  }

  async create(
    personsDto: PersonsDto,
    relationsDto: Array<RelationsDto> = undefined,
    authId: number,
  ): Promise<PersonsEntity> {
    if (personsDto.password) {
      const salt = await genSalt(10);
      personsDto.password = await hash(personsDto.password, salt);
    }
    if (personsDto.username) {
      const exists = await this.first({
        username: personsDto.username,
      });
      if (exists) {
        throw new BadRequestException('Person is exists', { cause: new Error(), description: 'invalid_person' });
      }
    }
    if (!personsDto.username) {
      personsDto.username = `${v4()}`;
    }
    const person = await super.create(personsDto, relationsDto, authId);
    if (!person) {
      throw new BadRequestException('Person is unknown, not registered, or parameters are set incorrectly', { cause: new Error(), description: 'invalid_person' });
    }
    return person;
  }
}
