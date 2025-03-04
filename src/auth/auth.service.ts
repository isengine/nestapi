import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonService } from '@src/common/common.service';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { AuthDto } from './auth.dto';
import { AuthEntity } from './auth.entity';

@Injectable()
export class AuthService extends CommonService<AuthDto, AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    protected readonly repository: Repository<AuthEntity>,
  ) {
    super();
  }

  async create(
    authDto: AuthDto,
    relations: Array<RelationsDto> = undefined,
  ): Promise<AuthEntity> {
    delete authDto.isSuperuser;
    return await super.create(authDto, relations);
  }

  async update(
    id: number,
    authDto: AuthDto,
    relations: Array<RelationsDto> = undefined,
  ): Promise<AuthEntity> {
    delete authDto.isSuperuser;
    return await super.update(id, authDto, relations);
  }

  async findByUsername(username: string): Promise<AuthEntity> {
    return await this.repository.findOneBy({ username });
  }

  async login(authDto: AuthDto): Promise<AuthEntity> {
    const auth = await this.findByUsername(authDto.username);
    if (!auth) {
      throw new UnauthorizedException('User not found');
    }
    const isValidPassword = await compare(authDto.password, auth.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!auth.isActivated) {
      throw new UnauthorizedException('Not activated');
    }
    return auth;
  }
}
